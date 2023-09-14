import { Center, Group, Header, Navbar, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { HEADER_HEIGHT, useStyles } from "./styles";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { FC } from "preact/compat";
import { mockdata } from ".";
interface NavbarLinkProps {
	icon: FC<any>;
	label: string;
	active?: boolean;
	onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
	const { classes, cx } = useStyles();
	return (
		<Tooltip
			label={label}
			position="right"
			transitionProps={{ duration: 0 }}
		>
			<UnstyledButton
				onClick={onClick}
				className={cx(classes.link, { [classes.active]: active })}
			>
				<Icon size="1.2rem" stroke={1.5} />
			</UnstyledButton>
		</Tooltip>
	);
}

export function NavbarMinimal({
	isMobile,
	setActive,
	active,
}: {
	isMobile: boolean;
	setActive: Function;
	active: number;
}) {
	const links = mockdata.map((link, index) => (
		<NavbarLink
			{...link}
			key={link.label}
			active={index === active}
			onClick={() => setActive(index)}
		/>
	));

	return isMobile ? (
		<Header height={HEADER_HEIGHT} mb={120}>
			<Center>
				<Group justify="center" spacing={0}>
					{links}
					<NavbarLink
						onClick={() => {
							localStorage.removeItem("token");
							window.location.reload();
						}}
						icon={IconLogout}
						label="Logout"
					/>
				</Group>
			</Center>
		</Header>
	) : (
		<Navbar height={"100%"} width={{ base: 80 }} p="md">
			<Center>
				<IconUser type="mark" stroke={"1"} size={30} />
			</Center>
			<Navbar.Section grow mt={50}>
				<Stack justify="center" spacing={0}>
					{links}
				</Stack>
			</Navbar.Section>
			<Navbar.Section>
				<Stack justify="center" spacing={0}>
					<NavbarLink
						onClick={() => {
							localStorage.removeItem("token");
							window.location.reload();
						}}
						icon={IconLogout}
						label="Logout"
					/>
				</Stack>
			</Navbar.Section>
		</Navbar>
	);
}
