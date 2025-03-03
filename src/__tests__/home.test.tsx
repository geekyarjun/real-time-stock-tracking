import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home Page", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the Next.js logo", () => {
    render(<Home />);
    const nextLogo = screen.getByAltText(/Next.js logo/i);
    expect(nextLogo).toBeInTheDocument();
  });

  it("renders the deploy button", () => {
    render(<Home />);
    const deployButton = screen.getByRole("link", { name: /Deploy now/i });
    expect(deployButton).toBeInTheDocument();
    expect(deployButton).toHaveAttribute(
      "href",
      expect.stringContaining("https://vercel.com/new")
    );
  });

  it("renders the Read our docs button", () => {
    render(<Home />);
    const docsButton = screen.getByRole("link", { name: /Read our docs/i });
    expect(docsButton).toBeInTheDocument();
    expect(docsButton).toHaveAttribute(
      "href",
      expect.stringContaining("https://nextjs.org/docs")
    );
  });

  it("renders the footer with links", () => {
    render(<Home />);
    const learnLink = screen.getByRole("link", { name: /Learn/i });
    const examplesLink = screen.getByRole("link", { name: /Examples/i });
    const nextLink = screen.getByRole("link", { name: /Go to nextjs.org/i });

    expect(learnLink).toBeInTheDocument();
    expect(examplesLink).toBeInTheDocument();
    expect(nextLink).toBeInTheDocument();
  });
});
