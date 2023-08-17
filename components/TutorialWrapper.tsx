import { useEffect, useState } from "preact/hooks";
import * as preact from "preact";

interface TutorialWrapperProps {
  children: preact.ComponentChildren;
  currentPanel: number;
  showPanel: number;
  maxPanel: number;
}

export default function TutorialWrapper({
  children,
  currentPanel,
  showPanel,
  maxPanel,
}: TutorialWrapperProps) {
  const [blurClass, setBlurClass] = useState("");
  const [wasBlurred, setWasBlurred] = useState(false);
  const [wasScrolled, setWasScrolled] = useState(false);

  const childId = `tutorial-wrapper-child-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  useEffect(() => {
    const shouldBlur = currentPanel !== showPanel && currentPanel < maxPanel;
    setBlurClass(shouldBlur ? "opacity-10" : "");
    setWasBlurred(shouldBlur);
  }, [currentPanel, showPanel, maxPanel]);

  useEffect(() => {
    if (blurClass === "") {
      setTimeout(() => {
        const element = document.getElementById(childId);
        if (element) {
          // element.scrollIntoView({ behavior: "smooth" });
          // scroll 100px above the element
          window.scrollTo({
            top: element.offsetTop - 100,
            behavior: "smooth",
          });
        }
        setWasScrolled(true);
      }, 0); // Delay for 100ms
    }
  }, [blurClass, wasScrolled, wasBlurred]);

  const child = children as preact.VNode<any>;

  // Make a copy of the children so you can modify it
  const newChildren = preact.cloneElement(child, {
    className: `${child.props?.className ?? ""} ${blurClass}`,
    id: childId,
  });

  return newChildren;
}
