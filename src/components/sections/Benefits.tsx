import React from "react";

import { FEATURES } from "@/data";
import { StepGuidedBlocks } from "./StepGuidedSection";
import { Button, SectionTag } from "@/components/ui";

function Benefits() {
	return (
			<section className='py-11 px-5 md:px-16 md:py-20'>
				<div className='container flex flex-col gap-16'>
					<div className='container mx-auto flex max-w-screen-md flex-col place-items-center gap-8 text-center'>
						<div className='flex flex-col place-items-center gap-4'>
							<SectionTag rotation={-5}>Lo más importante</SectionTag>
							<h2 className='text-4xl md:text-5xl font-heading'>
								Mientras otros servicios ofrecén obtener mas clientes nosotros
								optimizamos en función de lo que genera más ventas.
							</h2>
						</div>
						<p className='text-lg'>
							Ayudamos a negocios locales a incrementar sus ventas mensuales,
							nos encargamos de encontrarte clientes y dejarte el resto a ti.
						</p>
						<Button>Agenda una llamada</Button>
					</div>
				<StepGuidedBlocks blocks={FEATURES} />

				</div>
			</section>
	);
}

export default Benefits;
