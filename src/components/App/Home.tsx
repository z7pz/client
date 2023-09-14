import { Container, Title } from "@mantine/core";
import { useStyles } from ".";
import { IExam, IUser } from "../../api";
import { EditPage } from "./EditPage";
import { TableExams } from "./TableExams";

export function Home({
	exams,
	user,
	users,
	setEditing,
	setExams,
	isEditing,
}: {
	exams: IExam[];
	user: IUser;
	users: IUser[] | null;
	setEditing: Function;
	setExams: Function;
	isEditing: IExam | null;
}) {
	const { classes } = useStyles();
	return (
		<Container
			style={{ minWidth: "350px" }}
			size="sm"
			className={classes.wrapper}
		>
			{!isEditing ? (
				<Title align="center" className={classes.title}>
					Exams and Quiz marks
				</Title>
			) : (
				""
			)}

			{isEditing ? (
				<EditPage
					setEditing={setEditing}
					setExams={setExams}
					exam={isEditing}
					users={users!}
				/>
			) : (
				<TableExams
					exams={exams}
					setEditing={setEditing}
					user={user}
				/>
			)}
		</Container>
	);
}
