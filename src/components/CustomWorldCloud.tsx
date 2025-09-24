'use client';
import React, { useEffect, useRef } from 'react';
import cloud from 'd3-cloud';
import * as d3 from 'd3';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

type Props = {
	formattedTopics: { text: string; value: number }[];
};

const CustomWordCloud = ({ formattedTopics }: Props) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const { theme } = useTheme();
	// 1. Correctly initialize the router
	const router = useRouter();

	useEffect(() => {
		if (!svgRef.current || !formattedTopics) return;
		d3.select(svgRef.current).selectAll('*').remove();

		const words = formattedTopics.map((topic) => ({
			text: topic.text,
			size: topic.value,
		}));

		const fontScale = d3
			.scaleLinear()
			.domain(d3.extent(words, (d) => d.size) as [number, number])
			.range([20, 80]);

		const layout = cloud()
			.size([500, 400])
			.words(words)
			.padding(5)
			.rotate(() => (Math.random() > 0.7 ? 90 : 0))
			.font('sans-serif')
			.fontSize((d) => fontScale(d.size ?? 10))
			.on('end', draw);

		layout.start();

		function draw(drawnWords: any) {
			const svg = d3
				.select(svgRef.current)
				.attr('viewBox', '0 0 500 400')
				.append('g')
				.attr('transform', 'translate(250,200)');

			svg
				.selectAll('text')
				.data(drawnWords)
				.enter()
				.append('text')
				.style('font-size', (d: any) => `${d.size}px`)
				.style('font-family', 'sans-serif')
				.style('fill', theme === 'dark' ? 'white' : 'black')
				.style('cursor', 'pointer')
				.attr('text-anchor', 'middle')
				.attr(
					'transform',
					(d: any) => `translate(${d.x},${d.y})rotate(${d.rotate})`,
				)
				.text((d: any) => d.text)
				.on('click', (event, d: any) => {
					router.push(`/quiz?topic=${encodeURIComponent(d.text)}`);
				})
				.on('mouseover', function () {
					d3.select(this).style('opacity', 0.7);
				})
				.on('mouseout', function () {
					d3.select(this).style('opacity', 1);
				});
		}
	}, [theme, formattedTopics, router]);

	return <svg ref={svgRef} width={500} height={400}></svg>;
};

export default CustomWordCloud;
