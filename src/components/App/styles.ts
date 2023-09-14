import { createStyles, rem } from "@mantine/core";

export const HEADER_HEIGHT = rem(80);

export const useStyles = createStyles((theme) => ({
	progressBar: {
		"&:not(:first-of-type)": {
			borderLeft: `${rem(3)} solid ${
				theme.colorScheme === "dark"
					? theme.colors.dark[7]
					: theme.white
			}`,
		},
	},
	link: {
		width: rem(50),
		height: rem(50),
		borderRadius: theme.radius.md,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[0]
				: theme.colors.gray[7],

		"&:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[5]
					: theme.colors.gray[0],
		},
	},
	wrapper: {
		paddingTop: `calc(${theme.spacing.xl} * 2)`,
		paddingBottom: `calc(${theme.spacing.xl} * 2)`,
		minHeight: 650,
	},
	active: {
		"&, &:hover": {
			backgroundColor: theme.fn.variant({
				variant: "light",
				color: theme.primaryColor,
			}).background,
			color: theme.fn.variant({
				variant: "light",
				color: theme.primaryColor,
			}).color,
		},
	},

	title: {
		marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
	},
	inner: {
		height: HEADER_HEIGHT,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
}));