/**
 * MIT License
 *
 * Copyright (c) 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * CustomInfoWindow 컴포넌트
 *
 * CustomOverlayMap을 기반으로 InfoWindow 스타일링을 추가한 컴포넌트
 * - React 컴포넌트를 content로 전달하면 React 렌더링 + style/arrowStyle 적용
 * - 문자열이나 HTMLElement를 전달하면 그대로 사용
 * - 모든 React 이벤트 핸들러와 Hooks 사용 가능 (React 컴포넌트 사용 시)
 * - MapMarker의 children으로 사용시 position과 marker는 자동으로 제공됨
 */

import React, { useMemo } from "react";
import { useMapContext } from "./hook/useKakaoLoader";
import { useMarkerContext } from "./Marker";
import { CustomOverlayMap } from "./CustomOverlay";
import { CustomInfoWindowProps } from "./types";

export const CustomInfoWindow: React.FC<CustomInfoWindowProps> = ({
    position: positionProp,
    content,
    style,
    arrowStyle,
    zIndex = 1000,
    visible = true,
    marker: markerProp,
    markerHeight = 40, // 기본 카카오 마커 높이 (40px)
}) => {
    const { selectedMarker } = useMapContext();

    // MarkerContext에서 마커 정보 가져오기 (optional)
    let markerContext;
    try {
        markerContext = useMarkerContext();
    } catch {
        // MapMarker 외부에서 사용되는 경우 무시
        markerContext = null;
    }

    // marker와 position 결정 우선순위:
    // 1. prop으로 전달된 값
    // 2. MarkerContext에서 제공된 값
    const marker = markerProp || markerContext?.marker;
    const position = positionProp || markerContext?.position;

    // marker가 selectedMarker와 같은지 확인하여 표시 여부 결정
    const shouldShow = useMemo(() => {
        // marker prop이 있으면 selectedMarker와 비교
        if (marker) {
            return marker === selectedMarker && visible;
        }
        // marker prop이 없으면 visible prop만 사용
        return visible;
    }, [marker, selectedMarker, visible]);

    // 위치 계산 - marker prop이 있으면 마커 위치 사용
    const overlayPosition = useMemo(() => {
        if (marker) {
            const pos = marker.getPosition();
            return { lat: pos.getLat(), lng: pos.getLng() };
        }
        return position;
    }, [marker, position]);

    // content가 React 엘리먼트인지 확인
    const isReactElement = useMemo(() => {
        return React.isValidElement(content);
    }, [content]);

    // React 엘리먼트가 아닌 경우 (문자열 또는 HTMLElement)
    if (!isReactElement) {
        const contentString =
            typeof content === "string"
                ? content
                : (content as HTMLElement).outerHTML;

        return (
            <CustomOverlayMap
                position={overlayPosition!}
                zIndex={zIndex}
                visible={shouldShow}
                content={contentString}
            />
        );
    }

    // React 엘리먼트는 InfoWindow 스타일로 래핑
    const defaultStyles: React.CSSProperties = {
        position: "relative",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        minWidth: "100px",
    };

    const defaultArrowStyles: React.CSSProperties = {
        position: "absolute",
        bottom: "-10px", // InfoWindow 하단에 화살표 배치
        left: "50%",
        transform: "translateX(-50%)",
        width: "0",
        height: "0",
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderTop: "10px solid white", // 위를 향하는 화살표
        filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))", // 화살표에도 그림자
    };

    // CustomOverlayMap 재활용
    // absolute positioning으로 마커 위에 정확히 배치
    return (
        <CustomOverlayMap
            position={overlayPosition!}
            zIndex={zIndex}
            visible={shouldShow}
        >
            <div
                style={{
                    position: "absolute",
                    bottom: `${markerHeight + 10}px`, // 마커 높이 + 화살표 높이만큼 위로
                    left: "50%",
                    transform: "translateX(-50%)",
                    pointerEvents: "auto", // 클릭 이벤트 허용
                }}
            >
                <div style={{ ...defaultStyles, ...style }}>
                    {content as React.ReactElement}
                    <div style={{ ...defaultArrowStyles, ...arrowStyle }} />
                </div>
            </div>
        </CustomOverlayMap>
    );
};
