import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
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

describe("MenuItemReviewCreatePage tests", () => {

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
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {

        const queryClient = new QueryClient();
        const review = {
            itemId: "5",
            reviewerEmail: "cyrus895@ucsb.edu",
            stars: "5",
            dateReviewed: "2022-01-02T12:00",
            comments: "great"
        };

        axiosMock.onPost("/api/menuitemreview/post").reply(202, review);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("item ID")).toBeInTheDocument();
        });

        const idInput = screen.getByLabelText("item ID");
        expect(idInput).toBeInTheDocument();

        const emailInput = screen.getByLabelText("Reviewer Email");
        expect(emailInput).toBeInTheDocument();

        const starsInput = screen.getByLabelText("Stars");
        expect(starsInput).toBeInTheDocument();

        const dateInput = screen.getByLabelText("Date Reviewed");
        expect(dateInput).toBeInTheDocument();

        const commentsInput = screen.getByLabelText("Comments");
        expect(commentsInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(idInput, { target: { value: '5' } })
        fireEvent.change(emailInput, { target: { value: 'cyrus895@ucsb.edu' } })
        fireEvent.change(starsInput, { target: { value: '5' } })
        fireEvent.change(dateInput, { target: { value: '2022-01-02T12:00' } })
        fireEvent.change(commentsInput, { target: { value: 'great' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            itemId: "5",
            reviewerEmail: "cyrus895@ucsb.edu",
            stars: "5",
            dateReviewed: "2022-01-02T12:00",
            comments: "great"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New review Created - itemId: 5 reviewerEmail: cyrus895@ucsb.edu stars: 5 dateReviewed: 2022-01-02T12:00 comments: great");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

    });
});


