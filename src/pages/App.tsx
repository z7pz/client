import { useEffect, useState } from "preact/hooks";
import { useWindowSize } from "../hooks/use-window";
import { Api, IExam, IUser, Roles } from "../api";
import { NavbarMinimal, mockdata } from "../components/App";
import { Center, Loader } from "@mantine/core";

export function App() {
	const { isMobile } = useWindowSize();
	const [active, setActive] = useState(0);
	const Page = mockdata[active].jsx;
	const [loading, setLoading] = useState(true);
	const [exams, setExams] = useState<IExam[]>([]);
	const [users, setUsers] = useState<IUser[] | null>(null);
	const [user, setUser] = useState<IUser | null>(null);
	const [isEditing, setEditing] = useState<IExam | null>(null);
	useEffect(() => {
		(async () => {
			const api = new Api();
			const user = await api.user.get_user().catch(() => null);
			if (!user) {
				window.location.href = "/login";
				return;
			}
			const exams = await api.exam
				.get_exams()
				.catch((er) => console.log(er));
			if (exams) {
				setExams(exams.data);
			}
			if(user.data.role == Roles.Admin || user.data.role == Roles.Teacher) {
				const users = await api.user.all();
				setUsers(users.data)
			}
			setUser(user.data);
			setLoading(false);
		})();
	}, []);
	return !loading ? (
		<div
			style={{
				display: !isMobile ? "flex" : undefined,
				height: "100%",
				width: "100%",
			}}
		>
			<NavbarMinimal
				isMobile={isMobile}
				active={active}
				setActive={setActive}
			/>
			<Page
				isEditing={isEditing}
				setEditing={setEditing}
				user={user!}
				users={users}
				setExams={setExams}
				exams={exams}
			/>
		</div>
	) : (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				height: "100%",
			}}
		>
			<Loader />
		</div>
	);
}
