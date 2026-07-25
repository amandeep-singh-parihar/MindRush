"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export interface QuestionInput {
  id?: number;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  difficulty?: string;
  marks?: number;
}

export interface QuizInputPayload {
  title?: string;
  topic: string;
  difficulty: string;
  questionsCount: number;
  description?: string;
  timeLimit?: number;
  questions: QuestionInput[];
}

export interface AnswerInput {
  questionId?: number;
  questionText?: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeTaken?: number;
}

export interface SubmitAttemptPayload {
  quizId: number;
  score: number;
  percentage: number;
  timeTaken: number;
  answers: AnswerInput[];
}

/**
 * Helper to get or create Prisma User safely for logged-in NextAuth user
 */
async function getOrCreateUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const email = session.user.email.trim().toLowerCase();

  let user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: session.user.name || email.split("@")[0],
        email: email,
        image: session.user.image || null,
      },
    });
  }

  return user;
}

/**
 * 1. Save a newly generated quiz into PostgreSQL DB
 */
export async function saveGeneratedQuizAction(payload: QuizInputPayload) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return {
        success: false,
        message: "User not logged in or account not found",
      };
    }

    const createdQuiz = await prisma.quiz.create({
      data: {
        title: payload.title || `${payload.topic || "AI"} Quiz`,
        topic: payload.topic || "General",
        difficulty: payload.difficulty || "Medium",
        description:
          payload.description ||
          `Personalized AI quiz generated on ${payload.topic || "general knowledge"}.`,
        timeLimit: payload.timeLimit || Math.max(1, payload.questionsCount * 2),
        visibility: "public",
        createdBy: { connect: { id: user.id } },
        questions: {
          create: payload.questions.map((q) => ({
            question: q.question,
            type: "multiple_choice",
            options: q.options,
            correctAnswers: [q.answer],
            explanation: q.explanation || "",
            difficulty: q.difficulty || payload.difficulty || "Medium",
            marks: q.marks || 1,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/dashboard/history");
    revalidatePath("/dashboard/analytics");

    return {
      success: true,
      quizId: createdQuiz.id,
      quiz: {
        id: createdQuiz.id,
        title: createdQuiz.title,
        topic: createdQuiz.topic,
        difficulty: createdQuiz.difficulty,
        timeLimit: createdQuiz.timeLimit,
        questions: createdQuiz.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          answer: q.correctAnswers[0] || "",
          explanation: q.explanation,
        })),
      },
    };
  } catch (error: unknown) {
    console.error("[ERROR] Failed to save generated quiz:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save quiz",
    };
  }
}

/**
 * 2. Submit a completed quiz attempt and update user statistics
 */
export async function submitQuizAttemptAction(payload: SubmitAttemptPayload) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return {
        success: false,
        message: "User not logged in",
      };
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: payload.quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return {
        success: false,
        message: "Quiz not found in database",
      };
    }

    // Match each answer with the corresponding Question ID in DB
    const answersData = payload.answers.map((ans, idx) => {
      let qId = ans.questionId;
      if (!qId && quiz.questions[idx]) {
        qId = quiz.questions[idx].id;
      }
      return {
        questionId: qId!,
        selectedAnswer: ans.selectedAnswer ? [ans.selectedAnswer] : [],
        isCorrect: ans.isCorrect,
        timeTaken: ans.timeTaken || 0,
      };
    });

    // Create QuizAttempt record
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score: payload.score,
        percentage: payload.percentage,
        timeTaken: payload.timeTaken,
        startedAt: new Date(Date.now() - payload.timeTaken * 1000),
        completedAt: new Date(),
        answers: {
          create: answersData.filter((a) => a.questionId),
        },
      },
    });

    // Update UserStatistics in DB
    const existingStats = await prisma.userStatistics.findUnique({
      where: { userId: user.id },
    });

    const currentTotalQuizzes = (existingStats?.totalQuizzesTaken || 0) + 1;
    const currentTotalQuestions =
      (existingStats?.totalQuestionsAnswered || 0) + payload.answers.length;
    const currentCorrect = (existingStats?.correctlyAnswered || 0) + payload.score;
    const currentAccuracy =
      currentTotalQuestions > 0 ? (currentCorrect / currentTotalQuestions) * 100 : 0;
    const currentStudyTime =
      (existingStats?.totalStudyTime || 0) + Math.max(1, Math.round(payload.timeTaken / 60));

    // Calculate streak
    let newStreak = (existingStats?.currentStreak || 0) + 1;
    let newMaxStreak = Math.max(existingStats?.maxStreak || 0, newStreak);

    await prisma.userStatistics.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        totalQuizzesTaken: 1,
        totalQuestionsAnswered: payload.answers.length,
        correctlyAnswered: payload.score,
        accuracy: (payload.score / payload.answers.length) * 100,
        currentStreak: 1,
        maxStreak: 1,
        totalStudyTime: Math.max(1, Math.round(payload.timeTaken / 60)),
      },
      update: {
        totalQuizzesTaken: currentTotalQuizzes,
        totalQuestionsAnswered: currentTotalQuestions,
        correctlyAnswered: currentCorrect,
        accuracy: currentAccuracy,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        totalStudyTime: currentStudyTime,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/dashboard/history");
    revalidatePath("/dashboard/analytics");

    return {
      success: true,
      attemptId: attempt.id,
    };
  } catch (error: unknown) {
    console.error("[ERROR] Failed to submit quiz attempt:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save attempt",
    };
  }
}

/**
 * 3. Delete a created quiz
 */
export async function deleteQuizAction(quizId: number) {
  try {
    const user = await getOrCreateUser();
    if (!user) return { success: false, message: "User not logged in" };

    // Verify creator
    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, creatorId: user.id },
    });

    if (!quiz) {
      return { success: false, message: "Quiz not found or unauthorized to delete" };
    }

    // Delete associated answers, attempts, questions, and quiz
    await prisma.$transaction([
      prisma.answer.deleteMany({ where: { quizAttempt: { quizId } } }),
      prisma.quizAttempt.deleteMany({ where: { quizId } }),
      prisma.question.deleteMany({ where: { quizId } }),
      prisma.quiz.delete({ where: { id: quizId } }),
    ]);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/dashboard/history");
    revalidatePath("/dashboard/analytics");

    return { success: true, message: "Quiz deleted successfully" };
  } catch (error: unknown) {
    console.error("[ERROR] Failed to delete quiz:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete quiz",
    };
  }
}

/**
 * 4. Fetch Quiz by ID from PostgreSQL
 */
export async function getQuizByIdAction(quizId: number) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) return { success: false, message: "Quiz not found" };

    return {
      success: true,
      quiz: {
        dbQuizId: quiz.id,
        title: quiz.title,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        questionsCount: quiz.questions.length,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          answer: q.correctAnswers[0] || "",
          explanation: q.explanation,
        })),
      },
    };
  } catch (error: unknown) {
    console.error("[ERROR] Failed to fetch quiz by ID:", error);
    return { success: false, message: "Failed to load quiz" };
  }
}

/**
 * 5. Data fetch helpers for Dashboard Server Components
 */
export async function getUserQuizzesData() {
  const user = await getOrCreateUser();
  if (!user) return [];

  const quizzes = await prisma.quiz.findMany({
    where: { creatorId: user.id },
    include: {
      _count: {
        select: {
          questions: true,
          attempts: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    topic: q.topic,
    difficulty: q.difficulty,
    questionsCount: q._count.questions,
    timeLimit: q.timeLimit,
    visibility: q.visibility,
    playsCount: q._count.attempts,
    createdAt: q.createdAt.toISOString(),
  }));
}

export async function getUserHistoryData() {
  const user = await getOrCreateUser();
  if (!user) return [];

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    include: {
      quiz: {
        select: {
          title: true,
          topic: true,
          difficulty: true,
          questions: {
            select: {
              id: true,
              question: true,
              correctAnswers: true,
            },
          },
        },
      },
      answers: true,
    },
    orderBy: { completedAt: "desc" },
  });

  return attempts.map((att) => ({
    id: att.id,
    quizId: att.quizId,
    quizTitle: att.quiz.title,
    topic: att.quiz.topic,
    difficulty: att.quiz.difficulty,
    score: att.score,
    totalQuestions: att.quiz.questions.length || att.answers.length,
    percentage: Math.round(att.percentage),
    timeTaken: att.timeTaken,
    completedAt: att.completedAt.toISOString(),
  }));
}

export async function getUserAnalyticsData() {
  const user = await getOrCreateUser();
  if (!user) {
    return {
      stats: {
        totalQuizzesTaken: 0,
        totalQuestionsAnswered: 0,
        correctlyAnswered: 0,
        accuracy: 0,
        totalStudyTime: 0,
      },
      categoryBreakdown: [],
      scoreProgressions: [],
    };
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      statistics: true,
      attempts: {
        include: {
          quiz: true,
        },
        orderBy: { completedAt: "asc" },
      },
    },
  });

  if (!fullUser) {
    return {
      stats: {
        totalQuizzesTaken: 0,
        totalQuestionsAnswered: 0,
        correctlyAnswered: 0,
        accuracy: 0,
        totalStudyTime: 0,
      },
      categoryBreakdown: [],
      scoreProgressions: [],
    };
  }

  const stats = fullUser.statistics || {
    totalQuizzesTaken: fullUser.attempts.length,
    totalQuestionsAnswered: fullUser.attempts.reduce((acc, a) => acc + (a.score > 0 ? 10 : 0), 0),
    correctlyAnswered: fullUser.attempts.reduce((acc, a) => acc + a.score, 0),
    accuracy: 0,
    totalStudyTime: 0,
  };

  // Group performance by topic
  const topicMap: Record<string, { totalScore: number; totalCount: number }> = {};
  fullUser.attempts.forEach((att) => {
    const topic = att.quiz?.topic || "General";
    if (!topicMap[topic]) {
      topicMap[topic] = { totalScore: 0, totalCount: 0 };
    }
    topicMap[topic].totalScore += att.percentage;
    topicMap[topic].totalCount += 1;
  });

  const categoryBreakdown = Object.entries(topicMap).map(([topic, data]) => ({
    topic,
    accuracy: Math.round(data.totalScore / data.totalCount),
  }));

  const scoreProgressions = fullUser.attempts.map((att) => ({
    date: att.completedAt.toLocaleDateString([], { month: "short", day: "numeric" }),
    percentage: Math.round(att.percentage),
  }));

  return {
    stats: {
      totalQuizzesTaken: stats.totalQuizzesTaken,
      totalQuestionsAnswered: stats.totalQuestionsAnswered,
      correctlyAnswered: stats.correctlyAnswered,
      accuracy: Math.round(stats.accuracy),
      totalStudyTime: stats.totalStudyTime,
    },
    categoryBreakdown,
    scoreProgressions,
  };
}

/**
 * 8. Account Deletion Actions (7-day scheduled deletion)
 */
export async function scheduleAccountDeletionAction() {
  try {
    const user = await getOrCreateUser();
    if (!user) return { success: false, message: "User not authenticated" };

    const scheduledDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { deletionScheduledAt: scheduledDate },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      deletionScheduledAt: scheduledDate.toISOString(),
      message: "Account deletion scheduled in 7 days.",
    };
  } catch (error: unknown) {
    console.error("[ERROR] Failed to schedule account deletion:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to schedule account deletion",
    };
  }
}

export async function cancelAccountDeletionAction() {
  try {
    const user = await getOrCreateUser();
    if (!user) return { success: false, message: "User not authenticated" };

    await prisma.user.update({
      where: { id: user.id },
      data: { deletionScheduledAt: null },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      message: "Account deletion request canceled successfully.",
    };
  } catch (error: unknown) {
    console.error("[ERROR] Failed to cancel account deletion:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to cancel account deletion",
    };
  }
}

export async function getAccountDeletionStatusAction() {
  try {
    const user = await getOrCreateUser();
    if (!user) return { deletionScheduledAt: null };

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { deletionScheduledAt: true },
    });

    return {
      deletionScheduledAt: dbUser?.deletionScheduledAt
        ? dbUser.deletionScheduledAt.toISOString()
        : null,
    };
  } catch {
    return { deletionScheduledAt: null };
  }
}

/**
 * 9. Send OTP for Account Deletion
 */
export async function sendAccountDeletionOTPAction() {
  try {
    const user = await getOrCreateUser();
    if (!user || !user.email) return { success: false, message: "User not authenticated" };

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Clear old tokens for user and create new
    await prisma.verificationToken.deleteMany({ where: { identifier: user.email } });
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: otpCode,
        expires,
      },
    });

    console.log(`[SECURITY OTP] Deletion OTP for ${user.email}: ${otpCode}`);

    return {
      success: true,
      email: user.email,
      otpCode,
      message: `OTP sent to ${user.email}`,
    };
  } catch (error: unknown) {
    console.error("[ERROR] Failed to send deletion OTP:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send OTP",
    };
  }
}

/**
 * 10. Verify OTP and schedule 7-day deletion
 */
export async function verifyOTPAndScheduleDeletionAction(otpInput: string) {
  try {
    const user = await getOrCreateUser();
    if (!user || !user.email) return { success: false, message: "User not authenticated" };

    const cleanInput = otpInput.trim();
    if (!cleanInput || cleanInput.length !== 6) {
      return { success: false, message: "Please enter a valid 6-digit OTP code." };
    }

    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: user.email,
        token: cleanInput,
        expires: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      return {
        success: false,
        message: "Invalid or expired OTP code. Please check your email and try again.",
      };
    }

    // Clear verification token
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email },
    });

    // Schedule deletion for 7 days
    const scheduledDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.user.update({
      where: { id: user.id },
      data: { deletionScheduledAt: scheduledDate },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      deletionScheduledAt: scheduledDate.toISOString(),
      message: "OTP verified! Account deletion scheduled for 7 days from today.",
    };
  } catch (error: unknown) {
    console.error("[ERROR] Failed to verify OTP:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to verify OTP",
    };
  }
}

/**
 * 11. Verify Password and Schedule 7-Day Deletion
 */
export async function verifyPasswordAndScheduleDeletionAction(passwordInput: string) {
  try {
    const user = await getOrCreateUser();
    if (!user || !user.email) return { success: false, message: "User not authenticated" };

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) return { success: false, message: "User not found" };

    // If user has a password set (credentials user), verify with bcrypt
    if (dbUser.password) {
      if (!passwordInput || !passwordInput.trim()) {
        return { success: false, message: "Please enter your current account password." };
      }

      const isValid = await bcrypt.compare(passwordInput.trim(), dbUser.password);
      if (!isValid) {
        return { success: false, message: "Incorrect password. Please check your credentials and try again." };
      }
    }

    // Schedule deletion for 7 days
    const scheduledDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.user.update({
      where: { id: user.id },
      data: { deletionScheduledAt: scheduledDate },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      deletionScheduledAt: scheduledDate.toISOString(),
      message: "Password verified! Account deletion scheduled for 7 days from today.",
    };
  } catch (error: unknown) {
    console.error("[ERROR] Failed to verify password for deletion:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to verify password",
    };
  }
}
