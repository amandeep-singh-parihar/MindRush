'use client';
import React, { useEffect, useRef } from 'react';
import cloud from 'd3-cloud';
import * as d3 from 'd3';
import { useTheme } from 'next-themes';

const words = [
	{ text: 'AI', size: 50 },
	{ text: 'Quiz', size: 30 },
	{ text: 'MindRush', size: 70 },
	{ text: 'Learning', size: 40 },
	{ text: 'deep', size: 10 },
	{ text: 'amandeep', size: 24 },
	{ text: 'parihar', size: 12 },
	{ text: 'testing1', size: 34 },
	{ text: 'testing2', size: 19 },
	{ text: 'testing3', size: 16 },
	{ text: 'testing4', size: 40 },
	{ text: 'AI', size: 50 },
	{ text: 'Quiz', size: 30 },
	{ text: 'MindRush', size: 70 },
	{ text: 'Learning', size: 40 },
	{ text: 'deep', size: 10 },
	{ text: 'amandeep', size: 24 },
	{ text: 'parihar', size: 12 },
	{ text: 'testing1', size: 34 },
	{ text: 'testing2', size: 19 },
	{ text: 'testing3', size: 16 },
	{ text: 'testing4', size: 40 },
];

const CustomWordCloud = () => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const { theme } = useTheme();

	useEffect(() => {
		if (!svgRef.current) return;

		d3.select(svgRef.current).selectAll('*').remove();

		const layout = cloud()
			.size([500, 400])
			.words(words.map((d) => ({ text: d.text, size: d.size })))
			.padding(5)
			.rotate(() => 0)
			.font('sans-serif')
			.fontSize((d) => d.size ?? 10)
			.on('end', draw);

		layout.start();

		function draw(words: any) {
			const svg = d3
				.select(svgRef.current)
				.attr('viewBox', '0 0 500 400')
				.append('g')
				.attr('transform', 'translate(250,200)');

			svg
				.selectAll('text')
				.data(words)
				.enter()
				.append('text')
				.style('font-size', (d: any) => `${d.size}px`)
				.style('font-family', 'sans-serif')
				.style('fill', theme === 'dark' ? 'white' : 'black')
				.attr('text-anchor', 'middle')
				.attr(
					'transform',
					(d: any) => `translate(${d.x},${d.y})rotate(${d.rotate})`,
				)
				.text((d: any) => d.text);
		}
	}, [theme]);

	return <svg ref={svgRef} width={500} height={400}></svg>;
};

export default CustomWordCloud;
