import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/RecommendationRequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit RecommendationRequest");
            expect(screen.queryByTestId("RecommendationRequestForm-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/RecommendationRequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "surpriseitsnewemail@mail.mail",
                professorEmail: "anotherone@mail.mail",
                explanation: "I don't really need to break free anymore",
                dateRequested: "2024-05-02T00:00",
                dateNeeded: "2024-05-02T11:00",
                done: false
            });
            axiosMock.onPut('/api/RecommendationRequest').reply(200, {
                id: "17",
                requesterEmail: "s@mail.com",
                professorEmail: "p@mail.com",
                explanation: "I need to break free",
                dateRequested: "2024-02-02T00:00",
                dateNeeded: "2024-02-02T11:00",
                done: "true"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(requesterEmailField).toHaveValue("surpriseitsnewemail@mail.mail");
            expect(professorEmailField).toHaveValue("anotherone@mail.mail");
            expect(explanationField).toHaveValue("I don't really need to break free anymore");
            expect(dateRequestedField).toHaveValue("2024-05-02T00:00");
            expect(dateNeededField).toHaveValue("2024-05-02T11:00");
            expect(doneField).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(requesterEmailField).toHaveValue("surpriseitsnewemail@mail.mail");
            expect(professorEmailField).toHaveValue("anotherone@mail.mail");
            expect(explanationField).toHaveValue("I don't really need to break free anymore");
            expect(dateRequestedField).toHaveValue("2024-05-02T00:00");
            expect(dateNeededField).toHaveValue("2024-05-02T11:00");
            expect(doneField).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: 'req@mail.mail' } })
            fireEvent.change(professorEmailField, { target: { value: 'pro@mail.mail' } })
            fireEvent.change(explanationField, { target: { value: "I need to break free" } })
            fireEvent.change(dateRequestedField, { target: { value: "2024-06-02T00:00" } })
            fireEvent.change(dateNeededField, { target: { value: "2024-06-02T11:00" } })
            fireEvent.change(doneField, { target: { value: false } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 requester: s@mail.com professor: p@mail.com");
            expect(mockNavigate).toBeCalledWith({ "to": "/RecommendationRequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "req@mail.mail",
                professorEmail: "pro@mail.mail",
                explanation: "I need to break free",
                dateRequested: "2024-06-02T00:00",
                dateNeeded: "2024-06-02T11:00",
                done: false
            })); // posted object

        });

       
    });
});


