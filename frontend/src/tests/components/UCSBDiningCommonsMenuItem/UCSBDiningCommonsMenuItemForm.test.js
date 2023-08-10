
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBDiningCommonsMenuItemForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Dining Common", "Name", "Station"];
    const testId = "UCSBDiningCommonsMenuItemForm";

    //passes
    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByText(/Dining Common/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in an Item", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm initialContents={ucsbDiningCommonsMenuItemFixtures.oneItem} />
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
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("TODO: testing id-prefix-submit mutation error", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();
    
    });

    

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );

        //test min length (1 character at least)
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Dining Common is required./);
        expect(screen.getByText(/Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/Station is required./)).toBeInTheDocument();

        
        //test max length
        const nameInput = screen.getByTestId(`${testId}-diningCommonsCode`);
        fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Dining Common Max length 30 characters/)).toBeInTheDocument();
        });
        
        const nameInput2 = screen.getByTestId(`${testId}-name`);
        fireEvent.change(nameInput2, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Name Max length 30 characters/)).toBeInTheDocument();
        });
        
        const nameInput3 = screen.getByTestId(`${testId}-station`);
        fireEvent.change(nameInput3, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Station Max length 30 characters/)).toBeInTheDocument();
        }); 

    });

});