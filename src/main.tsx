import { render } from "preact";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App, Login, Register } from "./pages";
import "./styles/index.css";
import { MantineProvider } from "@mantine/core";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

export function Main() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <App />,
		},
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/register",
			element: <Register />,
		},
	]);
	return (
		<>
			<MantineProvider
				withNormalizeCSS
				withGlobalStyles
				theme={{ colorScheme: "dark", loader: "bars" }}
			>
				<ModalsProvider>
					<Notifications />
					<RouterProvider router={router} />
				</ModalsProvider>
			</MantineProvider>
			<ToastContainer
				toastStyle={{ backgroundColor: "#191919", color: "white" }}
			/>
		</>
	);
}

render(<Main />, document.getElementById("app") as HTMLElement);
