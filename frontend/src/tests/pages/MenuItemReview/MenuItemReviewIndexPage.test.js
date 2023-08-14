import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
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

describe("MenuItemReviewIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "MenuItemReviewTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/menuitemreview/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Review/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Review/);
        expect(button).toHaveAttribute("href", "/menuitemreview/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three reviews correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/menuitemreview/all").reply(200, menuItemReviewFixtures.threeReviews);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("3"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("5");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("1");

        const createReviewButton = screen.queryByText("Create Review");
        expect(createReviewButton).not.toBeInTheDocument();

        const email = screen.getByText("cyrus895@ucsb.edu");
        expect(email).toBeInTheDocument();


        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/menuitemreview/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/menuitemreview/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/menuitemreview/all").reply(200, menuItemReviewFixtures.threeReviews);
        axiosMock.onDelete("/api/menuitemreview").reply(200, "Review with id 3 was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("3");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("Review with id 3 was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/menuitemreview");
        expect(axiosMock.history.delete[0].url).toBe("/api/menuitemreview");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
    });

});


