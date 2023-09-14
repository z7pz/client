import { toast } from "react-toastify";
import { Api, IExam, IGrade, IUser } from "../../api";
import { AxiosError } from "axios";
import {
	Button,
	Center,
	CloseButton,
	Divider,
	Flex,
	Loader,
	TextInput,
	Title,
} from "@mantine/core";
import { useEffect, useState } from "preact/hooks";
import { useForm } from "@mantine/form";
import { TableGrades } from "./TableGrades";

export function EditPage({
	exam,
	setExams,
	setEditing,
	users,
}: {
	exam: IExam;
	setExams: Function;
	setEditing: Function;
	users: IUser[];
}) {
	const [grades, setGrades] = useState<IGrade[] | null>(null);
	const form = useForm({
		initialValues: {
			name: exam.name,
			outof: exam.outof,
		},
		validate: {
			name: (name) =>
				name.length >= 4
					? null
					: "Exam title should include at least 4 characters",
		},
	});
	useEffect(() => {
		(async () => {
			try {
				const api = new Api();
				const grades = await api.exam.grades(exam.id);
				setGrades(grades.data);
			} catch (err) {}
		})();
	}, []);
	return (
		<>
			<Flex align="center" fullWidth justify="space-between">
				<Center>
					<Title style={{ margin: "none" }} size="24" align="center">
						Editing exam
					</Title>
				</Center>
				<CloseButton
					onClick={() => setEditing(null)}
					title="Close popover"
					size="xl"
					iconSize={20}
				/>
			</Flex>
			<br />
			<br />
			<form
				onSubmit={form.onSubmit(async () => {
					const { name, outof } = form.values;
					const api = new Api();
					try {
						let editing = toast.loading("Editing exam data...");
						await api.exam.edit_exam(exam.id, name, outof);
						toast.update(editing, {
							render: "Exam data edited!",
							type: "success",
							isLoading: false,
						});
						let getting = toast.loading(
							"Getting latest exams data..."
						);
						const exams = await api.exam.get_exams();
						toast.update(getting, {
							render: "Latest data acquired!",
							type: "success",
							isLoading: false,
						});
						setExams(exams.data);
					} catch (err) {
						if (err instanceof AxiosError) {
							toast.error(
								err.response
									? err.response.data
									: "Something went wrong."
							);
						}
					}
				})}
			>
				<Flex direction="column" gap="16px">
					<TextInput
						fullWidth
						label="Exam title"
						value={form.values.name}
						onChange={(event: any) =>
							form.setFieldValue(
								"name",
								event.currentTarget.value
							)
						}
						error={form.errors.name}
						placeholder="Final 1"
						required
					/>
					<TextInput
						fullWidth
						type="number"
						label="Exam out of"
						value={form.values.outof}
						onChange={(event: any) =>
							form.setFieldValue(
								"outof",
								event.currentTarget.value
							)
						}
						error={form.errors.outof}
						placeholder="100"
						required
					/>

					<Button type="submit" color="green" fullWidth>
						Save
					</Button>
					<Divider my="sm" variant="dashed" />
					{grades ? (
						<TableGrades
							users={users}
							exam={exam}
							grades={grades}
							setGrades={setGrades}
						/>
					) : (
						<Center>
							<Loader />
						</Center>
					)}
				</Flex>
			</form>
		</>
	);
}
