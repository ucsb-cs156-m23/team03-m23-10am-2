import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});



describe("UCSBOrganizationCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        //const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });
    test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {

        const queryClient = new QueryClient();
        const org = {
            orgCode: "23",
            orgTranslationShort: "UCSBPB",
            orgTranslation: "UCSB Pickleball Club",
            inactive: true
        };

        axiosMock.onPost("/api/UCSBOrganization/post").reply(202, org);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("UCSBOrganizationForm-orgCode")).toBeInTheDocument();
        });

        const myorgCode = screen.getByTestId("UCSBOrganizationForm-orgCode");
        const myorgTranslationShort = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const myorgTranslation = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const myinactive = screen.getByTestId("UCSBOrganizationForm-inactive");

        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(myorgCode, { target: { value: '23' } });
        fireEvent.change(myorgTranslationShort, { target: { value: 'LBJ' } });
        fireEvent.change(myorgTranslation, { target: { value: 'Lebron' } });
        fireEvent.change(myinactive, { target: { value: false } });

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "orgCode": "23",
                "orgTranslationShort": "LBJ",
                "orgTranslation": "Lebron",
                "inactive": "false"
            });

        // assert - toast was called with the expected message
        expect(mockToast).toBeCalledWith("New UCSBOrg Created - orgCode: 23");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

    });

});

