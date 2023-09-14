import {
	Button,
	Container,
	Input,
	Modal,
	ScrollArea,
	Select,
	Table,
	Text,
	TextInput,
} from "@mantine/core";
import { Api, IExam, IGrade, IUser } from "../../api";
import { useEffect, useRef, useState } from "preact/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import _ from "lodash";
import { useDisclosure } from "@mantine/hooks";

const convertArrayToObject = (array: any[], key: any) =>
	array.reduce((acc, curr) => {
		acc[curr[key]] = curr;
		return acc;
	}, {});

export function TableGrades({
	grades,
	exam,
	users,
	setGrades,
}: {
	grades: IGrade[];
	users: IUser[];
	exam: IExam;
	setGrades: Function;
}) {
	const [gradesObj, setGradesObj] = useState<any>(
		convertArrayToObject(grades, "id")
	);
	const form = useForm({
		initialValues: {
			grades: {
				...gradesObj,
			},
		},
	});
	const [isSame, setSame] = useState(true);
	const [user_id, setUserId] = useState<string | null>(null);
	const [mark, setMark] = useState<number>(0);

	const [opened, { open, close }] = useDisclosure(false);

	const ref = useRef<HTMLInputElement>(null);
	useEffect(() => {
		setSame(_.isEqual(gradesObj, form.values.grades));
	}, [form, grades, gradesObj]);
	const rows = grades.map((row) => {
		const user = users.find((u) => u.id == row.user_id);
		return (
			<tr key={row.id}>
				<td>{user ? user.display_name : "Unknown user"}</td>
				<td>{row.id}</td>
				<td>
					<Input
						type="number"
						styles={(theme) => ({
							input: {
								borderColor:
									form.values.grades[row.id as any]?.grade !=
									gradesObj[row.id]?.grade
										? theme.colors.red[7]
										: undefined,
							},
						})}
						// error={}
						onChange={(event: any) => {
							form.setValues({
								grades: {
									...form.values.grades,
									[row.id]: {
										...form.values.grades[row.id],
										grade: Number(
											event.currentTarget.value
										),
									},
								},
							});
						}}
						value={form.values.grades[row.id].grade}
						placeholder="mark"
					/>
				</td>
				<td>
					<Button
						color="red"
						onClick={async () => {
							setGrades((prev: any) =>
								prev.filter((c: any) => c.id != row.id)
							);
							let temp = form.values.grades;
							delete temp[row.id];
							form.setValues({
								grades: {
									...temp,
								},
							});
						}}
					>
						Delete
					</Button>
				</td>
			</tr>
		);
	});
	return (
		// @ts-ignore
		<ScrollArea>
			<form
				onSubmit={form.onSubmit(async () => {
					const array = [];
					let ref = form.values.grades;
					for (const id of Object.keys(ref)) {
						array.push(ref[id]);
					}
					const api = new Api();
					const res = await api.exam.edit_grades(exam.id, array);
					setGradesObj(convertArrayToObject(res.data, "id"));
				})}
			>
				<Table sx={{ minWidth: 300 }} verticalSpacing="xs">
					<thead>
						<tr>
							<th>user id</th>
							<th>mark id</th>
							<th>mark</th>
							<th></th>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</Table>
				{!isSame ? (
					<Text color="red">
						Unsaved changes will be lost, all changes must be saved
					</Text>
				) : (
					""
				)}
				<br />
				<Modal onClose={close} opened={opened}>
					<Container style={{ minHeight: "300px", height: "1px" }}>
						<div
							style={{
								display: "flex",
								height: "calc(100% - 40px)",
								justifyContent: "spaceBetween",
								flexDirection: "column",
							}}
						>
							<Select
								ref={ref}
								onChange={(value: string) => {
									const f = value;
									setUserId(f);
								}}
								data={users.map((c) => ({
									value: c.id,
									label: c.display_name,
								}))}
								dropdownPosition="bottom"
								label="Select user"
							/>
							<TextInput
								onChange={(e: any) =>
									setMark(+e.currentTarget.value)
								}
								type="number"
								label="Mark"
							/>
						</div>
						<Button
							color="green"
							fullWidth
							onClick={async () => {
								if (!user_id) {
									console.log("no id");
									return;
								}
								const api = new Api();
								notifications.show({
									message: "Creating...",
									id: "creating",
								});

								const create = await api.exam.create_mark(
									exam.id,
									mark,
									user_id
								);

								form.setFieldValue("grades", {
									[create.data.id]: create.data,
									...form.values.grades,
								});
								setGradesObj(
									convertArrayToObject(
										[...grades, create.data],
										"id"
									)
								);
								setGrades((prev: any) => [
									...prev,
									create.data,
								]);

								notifications.update({
									message: "user mark created!",
									id: "creating",
								});
							}}
						>
							Create
						</Button>
					</Container>
				</Modal>
				<Button
					onClick={() => {
						open();
						// openCreateGradeModal();
						// form.setValues()
					}}
					color="violet"
					fullWidth
				>
					+
				</Button>
				<br />
				<Button type="submit" fullWidth>
					Save
				</Button>
			</form>
		</ScrollArea>
	);
}
