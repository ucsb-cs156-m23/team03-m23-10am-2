import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("MenuItemReviewForm tests", () => {

    const queryClient = new QueryClient();
    const testId = "MenuItemReviewForm";
    const expectedHeaders = ["item ID", "Reviewer Email", "Stars", "Date Reviewed", "Comments"];
    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Item Id is required/);
        expect(screen.getByText(/Reviewer Email is required/)).toBeInTheDocument();
        expect(screen.getByText(/Stars are required/)).toBeInTheDocument();
        expect(screen.getByText(/datereviewed is required/)).toBeInTheDocument();
        expect(screen.getByText(/Comments is required/)).toBeInTheDocument();


    });
    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: 'c' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'cc' } });
        fireEvent.change(starsField, { target: { value: '8' } });
        fireEvent.change(dateReviewedField, { target: { value: '08/02' } });
        fireEvent.change(commentsField, { target: { value: 'dank' } });

        fireEvent.click(submitButton);


        await screen.findByText(/Item Id must be a number/);
        expect(screen.getByText(/Reviewer Email must be valid/)).toBeInTheDocument();
        expect(screen.getByText(/between 1 and 5/)).toBeInTheDocument();
        expect(screen.getByText(/datereviewed is required./)).toBeInTheDocument();

    });
    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-submit");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Item Id is required/);
        expect(screen.getByText(/Reviewer Email is required/)).toBeInTheDocument();
        expect(screen.getByText(/Stars are required./)).toBeInTheDocument();
        expect(screen.getByText(/datereviewed is required./)).toBeInTheDocument();
        expect(screen.getByText(/Comments is required/)).toBeInTheDocument();

    });


    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: '1' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'yrus899@ucsb.edu' } });
        fireEvent.change(starsField, { target: { value: '5' } });
        fireEvent.change(dateReviewedField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(commentsField, { target: { value: 'dank' } });

        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Item Id must be an integer/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Reviewer Email must be valid/)).not.toBeInTheDocument();
        expect(screen.queryByText(/between 1 and 5/)).not.toBeInTheDocument()

    });


});