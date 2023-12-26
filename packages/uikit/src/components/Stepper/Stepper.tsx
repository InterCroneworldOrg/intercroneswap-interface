import React, { ReactNode } from "react";
import styled from "styled-components";
import { ThemedProps } from "./types";

interface StepperProps {
  children: ReactNode[];
}

const StepperWrapper = styled.div<ThemedProps>`
  display: flex;
  flex-direction: column;
  width: fit-content;
`;

const Stepper: React.FC<StepperProps> = ({ children }) => {
  const numberOfSteps = React.Children.count(children);
  return (
    <StepperWrapper>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { numberOfSteps });
        }
        return child;
      })}
    </StepperWrapper>
  );
};

export default Stepper;
