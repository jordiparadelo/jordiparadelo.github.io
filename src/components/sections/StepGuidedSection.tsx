import React from "react";
import { Accordion, AccordionItem } from "../ui/Accordion";
import Image, { StaticImageData } from "next/image";

export type StepGuidedProps = {
	title?: string;
	description?: string;
	details?: Array<{
		title: string;
		description: string;
	}>;
	image?: StaticImageData | string;
};

export function StepGuidedBlocks({ blocks }: { blocks: StepGuidedProps[] }) {
	return (
		<ul className='container mx-auto flex max-w-screen-md flex-col gap-20'>
			{blocks?.map((item) => (
				<li
					key={item.title}
					className='group flex flex-col gap-10 md:grid md:grid-cols-2 md:flex-wrap'
				>
					<StepGuided {...item} />
				</li>
			))}
		</ul>
	);
}

function StepGuided({ title, description, details, image }: StepGuidedProps) {
	return (
		<>
			{image && (
				<Image
					src={image}
					alt='process'
					width={500}
					height={500}
					className='object-contain md:group-odd:order-1'
				/>
			)}
			<div className='flex flex-col gap-5'>
				<h2 className='text-3xl '>{title}</h2>
				<p className='text-lg'>{description}</p>
				<Accordion>
					{details?.map((detail) => (
						<AccordionItem
							key={detail.title}
							title={detail.title}
							content={detail.description}
						/>
					))}
				</Accordion>
			</div>
		</>
	);
}