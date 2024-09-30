"use client";

import React from "react";
import {
	SubmitHandler,
	useForm,
	FormProvider,
	useFormContext,
	RegisterOptions,
	UseFormRegister,
} from "react-hook-form";
import styles from "@/styles/ContactForm.module.scss";
import { FormFieldsType } from "@/types";
import { useSearchParams } from "next/navigation";
import { useState } from 'react';

// Base validation rules
const baseValidationRules: Record<keyof FormFieldsType, RegisterOptions> = {
	name: {
		minLength: {
			value: 2,
			message: "El nombre debe tener al menos 2 caracteres",
		},
	},
	phone: {
		validate: (value: string) => {
			const phoneRegex = /^(\+34|0034|34)?[6789]\d{8}$/;
			return (
				!value ||
				phoneRegex.test(value) ||
				"Ingrese un número de teléfono español válido"
			);
		},
	},
	email: {
		validate: (value: string) => {
			const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
			return (
				!value ||
				emailRegex.test(value) ||
				"Ingrese un correo electrónico válido"
			);
		},
	},
	nameBusiness: {
		minLength: {
			value: 2,
			message: "El nombre del negocio debe tener al menos 2 caracteres",
		},
	},
	selectBusiness: {},
	message: {
		minLength: {
			value: 10,
			message: "El mensaje debe tener al menos 10 caracteres",
		},
		maxLength: {
			value: 500,
			message: "El mensaje no debe exceder los 500 caracteres",
		},
	},
	termsAccepted: {},
	service: {}, // Add this line
};

// Custom hook for field registration and validation
function useFieldValidation() {
	const {
		register,
		formState: { errors },
	} = useFormContext<FormFieldsType>();

	const getValidationRules = (
		registerType: keyof FormFieldsType,
		required: boolean
	): RegisterOptions => {
		const rules: RegisterOptions = { ...baseValidationRules[registerType] };

		if (required) {
			rules.required = "Este campo es requerido";
		}

		return rules;
	};

	const registerField = (
		registerType: keyof FormFieldsType,
		required: boolean
	): ReturnType<UseFormRegister<FormFieldsType>> => {
		return register(
			registerType,
			getValidationRules(registerType, required) as RegisterOptions<
				FormFieldsType,
				keyof FormFieldsType
			>
		);
	};

	return { registerField, errors };
}

function ContactForm() {
	const methods = useForm<FormFieldsType>();
	const searchParams = useSearchParams();
	const service = searchParams.get("service");
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

	const onSubmit: SubmitHandler<FormFieldsType> = async (data) => {
		console.log({data});
		setSubmitStatus('submitting');
		try {
			const response = await fetch('/api/submit-form', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Failed to submit form');
			}

			setSubmitStatus('success');
		} catch (error) {
			console.error('Error submitting form:', error);
			setSubmitStatus('error');
		}
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className={styles["form"]}>
				<div className={styles["form_group"]}>
					<InputField
						label='Nombre Completo'
						placeholder='Nombre'
						type='text'
						required={true}
						registerType='name'
					/>
					<InputField
						label='Teléfono'
						placeholder='Ejemplo: 612345678'
						type='tel'
						required={true}
						registerType='phone'
					/>
				</div>
				<InputField
					label='Correo Electrónico'
					placeholder='correo@ejemplo.com'
					type='email'
					required={true}
					registerType='email'
				/>
				<div className={styles["form_group"]}>
					<InputField
						label='Nombre del Negocio'
						placeholder='Mi Negocio S.A.'
						type='text'
						registerType='nameBusiness'
					/>
					<SelectField
						label='Tipo de Negocio'
						registerType='selectBusiness'
						// required={true}
						options={[
							{ value: "", label: "Seleccione un tipo de negocio" },
							{ value: "autonomous", label: "Autónomo" },
							{ value: "local-business", label: "Negocio Local" },
							{ value: "retail", label: "Proveedor" },
							{ value: "other", label: "Otro" },
						]}
					/>
				</div>
				<TextareaField
					label='Mensaje'
					placeholder='Escriba su mensaje aquí...'
					registerType='message'
					// required={true}
				/>
				{/* Send service id to the backend */}
				{service && (
					<InputField
						type='hidden'
						registerType='service'
						value={service}
					/>
				)}
				<CheckboxField
					label='Acepto los términos y condiciones proporcionados por la empresa. Al facilitar mi número de teléfono, acepto recibir mensajes de texto de la empresa.'
					registerType='termsAccepted'
					required={true}
				/>
				<div className='form_actions'>
					<button
						className='button button--primary'
						type='submit'
						disabled={submitStatus === 'submitting'}
					>
						{submitStatus === 'submitting' ? "Enviando..." : "Enviar Solicitud"}
					</button>
				</div>
				{submitStatus === 'success' && (
					<p className="text-green-500 mt-4">¡Formulario enviado con éxito!</p>
				)}
				{submitStatus === 'error' && (
					<p className="text-red-500 mt-4">Error al enviar el formulario. Por favor, inténtelo de nuevo.</p>
				)}
			</form>
		</FormProvider>
	);
}

export default ContactForm;

type InputFieldProps = {
	label?: string;
	type?: React.InputHTMLAttributes<HTMLElement>["type"];
	placeholder?: string;
	required?: boolean;
	registerType: keyof FormFieldsType;
	value?: string;
};

function InputField ({
	label,
	placeholder,
	type,
	required,
	registerType,
	value,
}: InputFieldProps) {
	const { registerField, errors } = useFieldValidation();

	return (
		<label className={styles["form_field"]}>
			{label && (
				<span className={styles["form_label"]}>
					{label} <span className='text-red-500'>{required && "*"}</span>
				</span>
			)}
			<input
				type={type}
				placeholder={placeholder}
				className={styles["form_input"]}
				{...registerField(registerType, !!required)}
				value={value}
			/>
			{errors[registerType] && (
				<span className='text-red-500'>{errors[registerType]?.message}</span>
			)}
		</label>
	);
}

type SelectFieldProps = {
	label: string;
	registerType: keyof FormFieldsType;
	required?: boolean;
	options: { value: string; label: string }[];
};

function SelectField({
	label,
	registerType,
	required,
	options,
}: SelectFieldProps) {
	const { registerField, errors } = useFieldValidation();

	return (
		<label className={styles["form_field"]}>
			<span className={styles["form_label"]}>
				{label} <span className='text-red-500'>{required && "*"}</span>
			</span>
			<select
				className={styles["form_input"]}
				{...registerField(registerType, !!required)}
			>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}
					>
						{option.label}
					</option>
				))}
			</select>
			{errors[registerType] && (
				<span className='text-red-500'>{errors[registerType]?.message}</span>
			)}
		</label>
	);
}

type TextareaFieldProps = {
	label: string;
	placeholder?: string;
	required?: boolean;
	registerType: keyof FormFieldsType;
};

function TextareaField({
	label,
	placeholder,
	required,
	registerType,
}: TextareaFieldProps) {
	const { registerField, errors } = useFieldValidation();

	return (
		<label className={styles["form_field"]}>
			<span className={styles["form_label"]}>
				{label} <span className='text-red-500'>{required && "*"}</span>
			</span>
			<textarea
				placeholder={placeholder}
				className={styles["form_textarea"]}
				{...registerField(registerType, !!required)}
			/>
			{errors[registerType] && (
				<span className='text-red-500'>{errors[registerType]?.message}</span>
			)}
		</label>
	);
}

type CheckboxFieldProps = {
	label: string;
	registerType: keyof FormFieldsType;
	required?: boolean;
};

function CheckboxField({ label, registerType, required }: CheckboxFieldProps) {
	const { registerField, errors } = useFieldValidation();

	return (
		<label className={styles["form_field_checkbox"]}>
			<div className='flex flex-row gap-3 place-items-start'>
				<input
					type='checkbox'
					className={styles["form_checkbox"]}
					{...registerField(registerType, !!required)}
				/>
				<span className={styles["form_label_checkbox"]}>
					{label} <span className='text-red-500'>{required && "*"}</span>
				</span>
			</div>
			{errors[registerType] && (
				<span className='text-red-500'>{errors[registerType]?.message}</span>
			)}
		</label>
	);
}
