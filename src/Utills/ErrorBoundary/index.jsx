import React from "react";
import SomethingWentWrong from "./SomethingWentWrong";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("UI Error caught:", error, info);
    // optional: send to backend / Sentry
  }

  render() {
    if (this.state.hasError) {
      return <SomethingWentWrong error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
