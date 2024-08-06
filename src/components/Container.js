import { forwardRef } from "react";
import clsx from "clsx";

const OuterContainer = forwardRef(function OuterContainer(
    { className, children, customStyles, showIcon, showHeader, headerText, ...props },
    ref
) {
    const containerStyle = {
        fontFamily: 'Monaco, monospace', // Change this to any default font you prefer
        ...customStyles,
    };

    return (
        <div ref={ref} className={clsx("sm:px-8", className)} style={containerStyle} {...props}>
            {(showIcon || showHeader) && (
                <div className="flex items-center justify-center space-x-2 mt-2">
                    {showIcon && (
                        <img src={process.env.PUBLIC_URL + '/logoWhite.png'} alt="logo" className="w-10 h-10" />
                    )}
                    {showHeader && (
                        <h1 className="text-3xl font-bold">
                            <span className="text-white">COMMENT</span>
                            <span className="text-stone-950" style={{ marginLeft: '6px' }}>WHIZ</span>
                        </h1>
                    )}
                </div>
            )}
            <div className="mx-3">{children}</div>
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
            className={clsx(`flex ${flexDirection} m-3 space-y-2 min-w-[250px] bg-custom-gray`, className)}
            style={{ ...customStyles}}
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
