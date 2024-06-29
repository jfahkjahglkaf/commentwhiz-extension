import { forwardRef } from "react";
import clsx from "clsx";

const OuterContainer = forwardRef(function OuterContainer(
    { className, children, customStyles, showIcon, showHeader, headerText, ...props },
    ref
) {
    return (
        <div ref={ref} className={clsx("sm:px-8", className)} style={customStyles} {...props}>
            {showIcon && (
                <img src={process.env.PUBLIC_URL + '/ext-icon.png'} alt="logo" className="w-10 h-10 mx-auto mt-5" />
            )}
            {showHeader && (
                <h1 className="text-center text-3xl font-bold">{headerText || "CommentWhiz"}</h1>
            )}
            <div className="m-3 rounded">{children}</div>
        </div>
    );
});


const InnerContainer = forwardRef(function InnerContainer(
    { className, children, customStyles, flexDirection = "flex-col", ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={clsx(`flex ${flexDirection} m-3 space-y-5 min-w-[250px] bg-custom-gray`, className)}
            style={customStyles}
            {...props}
        >
            {children}
        </div>
    );
});

export const Container = forwardRef(function Container(
    { children, customStyles, showIcon, showHeader, headerText, ...props },
    ref
) {
    return (
        <OuterContainer
            ref={ref}
            customStyles={customStyles}
            showIcon={showIcon}
            showHeader={showHeader}
            headerText={headerText}
            {...props}
        >
            <InnerContainer>{children}</InnerContainer>
        </OuterContainer>
    );
});

Container.Outer = OuterContainer;
Container.Inner = InnerContainer;
