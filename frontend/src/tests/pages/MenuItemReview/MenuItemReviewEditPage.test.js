import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

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
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", { params: { id: 1 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Review");
            expect(screen.queryByTestId("itemId")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/menuitemreview", { params: { id: 1 } }).reply(200, {
                itemId: "3", 
                reviewerEmail: "cyrus895@ucsb.edu",
                stars: "5",
                dateReviewed: "2022-01-02T12:00",
                comments: "Best food I've ever tasted. Marvelous",
            });
            axiosMock.onPut('/api/menuitemreview').reply(200, {
                itemId: "3", 
                reviewerEmail: "cyrus899@ucsb.edu",
                stars: "4",
                dateReviewed: "2022-02-02T12:00",
                comments: "Not as good",
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemId");

            const idField = screen.getByTestId("MenuItemReviewForm-itemId");
            const emailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("3");
            expect( emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("cyrus895@ucsb.edu");
            expect(starsField).toBeInTheDocument();
            expect(starsField).toHaveValue("5");
            expect( dateField).toBeInTheDocument();
            expect(dateField).toHaveValue("2022-01-02T12:00");
            expect(commentsField).toBeInTheDocument();
            expect(commentsField).toHaveValue("Best food I've ever tasted. Marvelous");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(emailField, { target: { value: 'cyrus899@ucsb.edu' } });
            fireEvent.change(starsField, { target: { value: '4' } });
            fireEvent.change(dateField, { target: { value: '2022-02-02T12:00' } });
            fireEvent.change(commentsField, { target: { value: 'Not as good' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Review Updated - itemId: 3 reviewerEmail: cyrus899@ucsb.edu stars: 4 dateReviewed: 2022-02-02T12:00 comments: Not as good");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: "3" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: "3",
                reviewerEmail: "cyrus899@ucsb.edu",
                stars: "4",
                dateReviewed: "2022-02-02T12:00",
                comments: "Not as good",
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-itemId");
            const emailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue("3");
            expect(emailField).toHaveValue("cyrus895@ucsb.edu");
            expect(starsField).toHaveValue("5");
            expect(dateField).toHaveValue("2022-01-02T12:00");
            expect(commentsField).toHaveValue("Best food I've ever tasted. Marvelous");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(idField, { target: { value: '3' } })
            fireEvent.change(emailField, { target: { value: 'cyrus899@ucsb.edu' } })
            fireEvent.change(starsField, { target: { value: '4' } })
            fireEvent.change(dateField, { target: { value: '2022-02-02T12:00' } })
            fireEvent.change(commentsField, { target: { value: 'Not as good' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Review Updated - itemId: 3 reviewerEmail: cyrus899@ucsb.edu stars: 4 dateReviewed: 2022-02-02T12:00 comments: Not as good");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
        });

       
    });
});
