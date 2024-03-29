import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "../../../../../jest.setup";

import * as ApiMethods from "../../../../Pages/Login/Api/LoginMethods";
import Navbar from "../Navbar";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn().mockReturnValue(jest.fn()),
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
}));

describe("Navbar", () => {
  test("renders correctly", () => {
    jest.spyOn(require("react-redux"), "useSelector").mockReturnValue({
      id: 1,
    });
    const { container } = renderWithProviders(<Navbar />);

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    const logoutButton = screen.getByRole("button", { name: "Logout" });

    expect(dashboardLink).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test("calls revokeToken function upon clicking on the logout button", async () => {
    const revokeTokenSpy = jest.spyOn(ApiMethods, "revokeToken");

    renderWithProviders(<Navbar />);

    const logoutButton = screen.getByRole("button", { name: "Logout" });

    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(revokeTokenSpy).toBeCalled();
    });
  });
});
