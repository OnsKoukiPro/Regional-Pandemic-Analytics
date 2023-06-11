import DashboardFrame from "@/src/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/src/components/common/unauth";
import { RoleList } from "@/src/modules/roles/views/List";
import { appRoles, roles } from "@/utils/auth";

export const LoadRoles = () => {
	const check: boolean = roles?.includes(appRoles.ADMINISTRATOR);
	return (
		<DashboardFrame>
			{check ? <RoleList /> : <Unauthorised />}
		</DashboardFrame>
	);
};

export default function Role() {
	return <LoadRoles />;
}