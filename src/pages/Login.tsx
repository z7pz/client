import {
	TextInput,
	PasswordInput,
	Anchor,
	Paper,
	Title,
	Text,
	Container,
	Button,
	Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Api } from "../api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useEffect } from "preact/hooks";

export function Login() {
	const form = useForm({
		initialValues: {
			username: "",
			password: "",
		},

		validate: {
			password: (val) =>
				val.length <= 6
					? "Password should include at least 6 characters"
					: null,
			username: (val) =>
				val.length <= 4
					? "Username should include at least 4 characters"
					: null,
		},
	});

	useEffect(() => {
		(async () => {
			const api = new Api();
			try {
				await api.user.get_user();
				window.location.href = "/";
			} catch (err) {}
		})();
	}, []);

	return (
		<Center style={{ height: "100%" }}>
			<Container size={420} my={40}>
				<Title
					align="center"
					sx={(theme: any) => ({
						fontFamily: `Greycliff CF, ${theme.fontFamily}`,
						fontWeight: 900,
					})}
				>
					Welcome everyone!
				</Title>
				<Text color="dimmed" size="sm" align="center" mt={5}>
					Go back to{" "}
					<a href="/register">
						<Anchor size="sm" component="button">
							Register page
						</Anchor>
					</a>
				</Text>
				<form
					onSubmit={form.onSubmit(async () => {
						const { username, password } = form.values;
						const api = new Api();
						try {
							const token = await api.auth.login(
								username,
								password
							);
							localStorage.setItem("token", token.data);
							toast.success(
								"Logged in successfully! Redirecting to main page..."
							);
							setTimeout(() => {
								window.location.href = "/";
							}, 5000);
						} catch (err: unknown) {
							if (err instanceof AxiosError) {
								toast.error(
									err.response
										? err.response.data
										: "Something went wrong..."
								);
							}
						}
					})}
				>
					<Paper withBorder shadow="md" p={30} mt={30} radius="md">
						<TextInput
							label="Username"
							value={form.values.username}
							onChange={(event: any) =>
								form.setFieldValue(
									"username",
									event.currentTarget.value
								)
							}
							error={form.errors.username}
							placeholder="Ahmed"
							required
						/>
						<PasswordInput
							label="Password"
							value={form.values.password}
							onChange={(event: any) =>
								form.setFieldValue(
									"password",
									event.currentTarget.value
								)
							}
							error={form.errors.password}
							placeholder="Your password"
							required
							mt="md"
						/>
						<Button type="submit" fullWidth mt="xl">
							Login
						</Button>
					</Paper>
				</form>
			</Container>
		</Center>
	);
}
