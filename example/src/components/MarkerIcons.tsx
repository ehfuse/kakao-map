/**
 * 커스텀 마커 아이콘 컴포넌트들
 */

interface NumberedMarkerProps {
    number: number;
    color?: string;
}

export function NumberedMarker({
    number,
    color = "#2196f3",
}: NumberedMarkerProps) {
    return (
        <svg
            width="36"
            height="36"
            viewBox="1 1 22 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <ellipse
                cx="12"
                cy="25.0"
                rx="2.3"
                ry="0.8"
                fill="rgba(0, 0, 0, 0.3)"
            />
            <path
                d="M12 2C7.589 2 4 5.589 4 10C4 13 5.5 15.5 7.5 17.5C9 19 11 22 12 25C13 22 15 19 16.5 17.5C18.5 15.5 20 13 20 10C20 5.589 16.411 2 12 2Z"
                fill={color}
            />
            <text
                x="12"
                y="14"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
            >
                {number}
            </text>
        </svg>
    );
}

interface StarMarkerProps {
    color?: string;
}

export function StarMarker({ color = "#9c27b0" }: StarMarkerProps) {
    return (
        <svg
            width="36"
            height="36"
            viewBox="1 1 22 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <ellipse
                cx="12"
                cy="25.0"
                rx="2.3"
                ry="0.8"
                fill="rgba(0, 0, 0, 0.3)"
            />
            <path
                d="M12 2C7.589 2 4 5.589 4 10C4 13 5.5 15.5 7.5 17.5C9 19 11 22 12 25C13 22 15 19 16.5 17.5C18.5 15.5 20 13 20 10C20 5.589 16.411 2 12 2Z"
                fill={color}
            />
            <text
                x="12"
                y="14"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
            >
                ⭐
            </text>
        </svg>
    );
}

interface HeartMarkerProps {
    color?: string;
}

export function HeartMarker({ color = "#e91e63" }: HeartMarkerProps) {
    return (
        <svg
            width="36"
            height="36"
            viewBox="1 1 22 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <ellipse
                cx="12"
                cy="25.0"
                rx="2.3"
                ry="0.8"
                fill="rgba(0, 0, 0, 0.3)"
            />
            <path
                d="M12 2C7.589 2 4 5.589 4 10C4 13 5.5 15.5 7.5 17.5C9 19 11 22 12 25C13 22 15 19 16.5 17.5C18.5 15.5 20 13 20 10C20 5.589 16.411 2 12 2Z"
                fill={color}
            />
            <text
                x="12"
                y="14"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
            >
                ❤️
            </text>
        </svg>
    );
}

interface CustomIconMarkerProps {
    icon: string;
    color?: string;
}

export function CustomIconMarker({
    icon,
    color = "#4caf50",
}: CustomIconMarkerProps) {
    return (
        <svg
            width="36"
            height="36"
            viewBox="1 1 22 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <ellipse
                cx="12"
                cy="25.0"
                rx="2.3"
                ry="0.8"
                fill="rgba(0, 0, 0, 0.3)"
            />
            <path
                d="M12 2C7.589 2 4 5.589 4 10C4 13 5.5 15.5 7.5 17.5C9 19 11 22 12 25C13 22 15 19 16.5 17.5C18.5 15.5 20 13 20 10C20 5.589 16.411 2 12 2Z"
                fill={color}
            />
            <text
                x="12"
                y="14"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
            >
                {icon}
            </text>
        </svg>
    );
}
