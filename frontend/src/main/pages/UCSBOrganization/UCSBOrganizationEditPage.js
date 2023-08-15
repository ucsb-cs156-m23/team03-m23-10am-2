import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import {Navigate, useParams} from "react-router-dom";
import {useBackend, useBackendMutation} from "../../utils/useBackend";
import {toast} from "react-toastify";
import UCSBOrganizationForm from 'main/components/UCSBOrganization/UCSBOrganizationForm';

export default function UCSBOrganizationEditPage({storybook=false}) {
    let { orgCode } = useParams();

    const { data: item, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/UCSBOrganization?orgCode=${orgCode}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/UCSBOrganization`,
                params: {
                    orgCode
                }
            }
        );

    const objectToAxiosPutParams = (item) => ({
        url: "/api/UCSBOrganization",
        method: "PUT",
        params: {
            orgCode: item.orgCode,
        },
        data: {
            orgTranslationShort: item.orgTranslationShort,
            orgTranslation: item.orgTranslation,
            inactive: item.inactive,
        }
    });

    const onSuccess = (item) => {
        toast(`UCSBOrg Updated - orgCode: ${item.orgCode}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/UCSBOrganization?orgCode=${orgCode}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/ucsborganization" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit UCSB Organization</h1>
                {
                    item && <UCSBOrganizationForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={item} />
                }
            </div>
        </BasicLayout>
    )
}