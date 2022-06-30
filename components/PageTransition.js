/**
 *! classNames
 ** fade-appear, fade-appear-active, fade-appear-done
 ** fade-enter, fade-enter-active, fade-enter-done
 ** fade-exit, fade-exit-active, fade-exit-done

*? onEnter

*? onEntering

*? onEntered

*? onExit

*? onExiting

*? onExited

 */

import { TransitionGroup, CSSTransition } from "react-transition-group";
import styled from "styled-components";
import gsap from "gsap";
import { useRef, useEffect, useState } from "react";

// it is important to set those styles to the main component
const MainComponent = styled.div`
  &.page-enter-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0;
    z-index: 100;
  }
  &.page-exit-active {
    // make sure that the window doesnt scroll to top using the routingPageOffset that came from the app component
    main {
      transform: translateY(-${(props) => props.routingPageOffset}px);
    }
  }
`;

const Grid = styled.div`
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  div {
    background-color: black;
    visibility: hidden;
  }
`;

const PageTransition = ({ children, route, routingPageOffset }) => {
  // the transitioning state is to find out if the animation is working or not
  // use useRef for the tl variable
  // use useRef for to target the element that yo will animate
  // create functions for the animation play and stop, later you call them inside the CSSTransition component
  // use the use effect to create your animation timeline
  // make sure that you make a condition of transitionRef to check if it is not undefined or it will cause a problem
  // finally you can kill the animation or timeline in order to cleanup
  const [transitioning, setTransioning] = useState();
  const tl = useRef();
  const transitionRef = useRef();
  const playTransition = () => {
    tl.current.play(0);
    setTransioning(true);
  };
  const stopTransition = () => {
    setTransioning("");
  };
  useEffect(() => {
    if (!transitionRef) {
      return;
    }
    const squares = transitionRef.current.children;

    gsap.set(squares, { autoAlpha: 1 });

    tl.current = gsap
      .timeline({ repeat: 1, repeatDelay: 0.2, yoyo: true, paused: true })
      .fromTo(
        squares,
        { scale: 0, borderRadius: "100%" },
        {
          scale: 1,
          borderRadius: 0,
          stagger: {
            grid: "auto",
            from: "edges",
            ease: "sine",
            amount: 0.9,
          },
        }
      );

    return () => {
      tl.current.kill();
    };
  }, []);

  return (
    <>
      <TransitionGroup component={null}>
        <CSSTransition
          onEnter={playTransition}
          onExited={stopTransition}
          key={route}
          classNames="page"
          timeout={1000}
        >
          <MainComponent routingPageOffset={routingPageOffset}>
            {children}
          </MainComponent>
        </CSSTransition>
      </TransitionGroup>
      <Grid ref={transitionRef}>
        {[...Array(100)].map(() => (
          <div></div>
        ))}
      </Grid>
    </>
  );
};

// const MainComponent = styled.div`
//   &.page-enter-active {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     opacity: 0;
//   }
//   &.page-exit {
//     ~ .wipe {
//       transform: translateY(100%);
//     }
//   }
//   &.page-exit-active {
//     ~ .wipe {
//       transform: translateY(0);
//       transition: transform 1000ms ease;
//     }
//     main {
//       transform: translateY(-${(props) => props.routingPageOffset}px);
//     }
//   }
//   &.page-enter-done {
//     ~ .wipe {
//       transform: translateY(-100%);
//       transition: transform 1000ms ease;
//     }
//   }
// `;
// const Wipe = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100vh;
//   background-color: #aaa;
//   z-index: 5;
//   transform: translateY(100%);
// `;
export default PageTransition;
