import { describe, expect, it } from "vitest";
import { render, screen } from "@test/test-utils";

import { Card, CardWithHeader } from "./Card";

describe("Card", () => {
  it("renders children inside the card body", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });
});

describe("CardWithHeader", () => {
  it("renders children inside the card body", () => {
    render(<CardWithHeader>Body content</CardWithHeader>);
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("renders title when title prop is provided", () => {
    render(<CardWithHeader title="My Title">Content</CardWithHeader>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders header node when header prop is provided without title", () => {
    render(
      <CardWithHeader header={<span>Custom Header</span>}>
        Content
      </CardWithHeader>,
    );
    expect(screen.getByText("Custom Header")).toBeInTheDocument();
  });

  it("renders footer when footer prop is provided", () => {
    render(
      <CardWithHeader footer={<span>Footer content</span>}>
        Content
      </CardWithHeader>,
    );
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("does not render header section when neither title nor header is provided", () => {
    const { container } = render(<CardWithHeader>Content</CardWithHeader>);
    // No header element rendered
    expect(container.querySelector(".chakra-card__header")).toBeNull();
  });

  it("does not render footer when footer prop is not provided", () => {
    const { container } = render(<CardWithHeader>Content</CardWithHeader>);
    expect(container.querySelector(".chakra-card__footer")).toBeNull();
  });
});
