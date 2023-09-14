import { Button, ScrollArea, Table } from "@mantine/core";
import { IExam, IUser, Roles } from "../../api";


interface TableReviewsProps {
	user: IUser;
	setEditing: Function;
	exams: IExam[];
}

export function TableExams({ exams, user, setEditing }: TableReviewsProps) {
	const rows = exams.map((row) => {
		let grades = user.grades.filter((c) =>
			row.grades
				.map((c) => {
					return c.toString();
				})
				.includes(c.id)
		);
		return (
			<tr key={row.name}>
				<td>{row.name}</td>
				{user.role !== Roles.Teacher ? (
					grades.length != 0 ? (
						<td style={{ color: "lightgreen" }}>
							{grades.map((c) => c.grade).join(", ")}
						</td>
					) : (
						<td style={{ color: "red" }}>Didn't take the exam</td>
					)
				) : (
					""
				)}
				<td>{row.outof}</td>
				<td dir={"rtl"}>
					{user.role == Roles.Admin ? (
						<Button onClick={() => setEditing(row)}>Edit</Button>
					) : (
						""
					)}
				</td>
			</tr>
		);
	});
	return (
		// @ts-ignore
		<ScrollArea>
			<Table sx={{ minWidth: 300 }} verticalSpacing="xs">
				<thead>
					<tr>
						<th>Exam</th>
						{user.role !== Roles.Teacher ? <th>My mark</th> : ""}
						<th>Out of</th>
						{user.role == Roles.Admin ? <th></th> : ""}
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</Table>
		</ScrollArea>
	);
}