import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";



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
        useParams: () => ({
            orgCode: "17"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("UCSBOrganizationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "17" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSB Organization");
            expect(screen.queryByTestId("UCSBOrganization-orgCode")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "17" } }).reply(200, {
                orgCode: "17",
                orgTranslationShort: "TT",
                orgTranslation: "Travis Time",
                inactive: false
            });
            axiosMock.onPut('/api/UCSBOrganization').reply(200, {
                orgCode: "17",
                orgTranslationShort: "TA",
                orgTranslation: "Bubble Tea",
                inactive: true
            });
        });

        const queryClient = new QueryClient();

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const myorgCode = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const myorgTranslationShort = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const myorgTranslation = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const myinactive = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(myorgCode).toBeInTheDocument();
            expect(myorgCode).toHaveValue("17");

            expect(myorgTranslationShort).toBeInTheDocument();
            expect(myorgTranslationShort).toHaveValue("TT");

            expect(myorgTranslation).toBeInTheDocument();
            expect(myorgTranslation).toHaveValue("Travis Time");

            //expect(myinactive).toHaveValue("false")
            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(myorgTranslationShort, { target: { value: 'TA' } });
            fireEvent.change(myorgTranslation, { target: { value: 'Bubble Tea' } });
            fireEvent.change(myinactive, { target: { value: true } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrg Updated - orgCode: 17");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "17" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgTranslationShort: "TA",
                orgTranslation: "Bubble Tea",
                inactive: "true"
            }));
        });



        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const myorgCode = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const myorgTranslationShort = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const myorgTranslation = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const myinactive = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(myorgCode).toHaveValue("17");
            expect(myorgTranslationShort).toHaveValue("TT");
            expect(myorgTranslation).toHaveValue("Travis Time");
            //expect(myinactive).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(myorgTranslationShort, { target: { value: 'TA' } });
            fireEvent.change(myorgTranslation, { target: { value: 'Bubble Tea' } });
            fireEvent.change(myinactive, { target: { value: true } });
            fireEvent.click(submitButton);
            
            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrg Updated - orgCode: 17");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });
        
        });
    });
});