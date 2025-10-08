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
 * MapMarker 컴포넌트
 */

import React, {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { MapMarkerProps, KakaoMarker } from "./types";
import { useMap } from "./hook/useKakaoLoader";
import { ClustererContext } from "./Map";
import { parsePosition, reactSvgToDataUrl } from "./utils";

// React.memo 적용하여 불필요한 리렌더링 방지
export const MapMarker = React.memo<MapMarkerProps>(
    ({
        position,
        image,
        title,
        clickable = false,
        draggable = false,
        zIndex,
        opacity = 1,
        altitude,
        range,
        onClick,
        onMouseOver,
        onMouseOut,
        onDragStart,
        onDragEnd,
        visible = true,
        children,
        clustered, // 새로운 prop - undefined면 자동으로 context clusterer 사용, false면 명시적 제외
        clusterer: clustererProp,
    }) => {
        const map = useMap();
        const contextClusterer = useContext(ClustererContext);

        // 클러스터러 결정 로직:
        // 1. prop으로 clusterer를 직접 전달한 경우 사용
        // 2. clustered={false}면 명시적으로 클러스터링 제외
        // 3. clustered가 undefined이고 context에 clusterer가 있으면 자동 클러스터링
        const clusterer =
            clustererProp ||
            (clustered === false ? null : contextClusterer || null);
        const [marker, setMarker] = useState<KakaoMarker | null>(null);

        // 마커 생성
        useEffect(() => {
            if (!map || !position) return;

            // 좌표 변환
            const kakaoPosition = parsePosition(position);
            if (!kakaoPosition) {
                console.error("마커 좌표 변환 실패");
                return;
            }

            // 마커 옵션
            // onClick 이벤트가 있으면 자동으로 clickable을 true로 설정
            const options: any = {
                position: kakaoPosition,
                map,
                title,
                clickable: onClick ? true : clickable,
                draggable,
                opacity,
                visible,
                zIndex,
            };

            // 이미지 설정
            if (image) {
                const imageSize = new window.kakao.maps.Size(
                    image.size.width,
                    image.size.height
                );

                // ReactNode인 경우 Data URL로 변환
                let imageSrc: string;
                if (typeof image.src === "string") {
                    imageSrc = image.src;
                } else if (React.isValidElement(image.src)) {
                    // React SVG 엘리먼트를 Data URL로 변환
                    imageSrc = reactSvgToDataUrl(image.src as ReactElement);
                } else {
                    console.error(
                        "지원하지 않는 이미지 타입입니다.",
                        image.src
                    );
                    return;
                }

                let markerImage;

                if (image.options?.offset) {
                    const offset = new window.kakao.maps.Point(
                        image.options.offset.x,
                        image.options.offset.y
                    );
                    markerImage = new window.kakao.maps.MarkerImage(
                        imageSrc,
                        imageSize,
                        { offset }
                    );
                } else {
                    markerImage = new window.kakao.maps.MarkerImage(
                        imageSrc,
                        imageSize
                    );
                }

                options.image = markerImage;
            }

            if (altitude !== undefined) options.altitude = altitude;
            if (range !== undefined) options.range = range;

            // 마커 생성
            const markerInstance = new window.kakao.maps.Marker(options);

            // 이벤트 리스너 등록
            if (onClick) {
                window.kakao.maps.event.addListener(
                    markerInstance,
                    "click",
                    () => onClick(markerInstance)
                );
            }

            if (onMouseOver) {
                window.kakao.maps.event.addListener(
                    markerInstance,
                    "mouseover",
                    () => onMouseOver(markerInstance)
                );
            }

            if (onMouseOut) {
                window.kakao.maps.event.addListener(
                    markerInstance,
                    "mouseout",
                    () => onMouseOut(markerInstance)
                );
            }

            if (onDragStart) {
                window.kakao.maps.event.addListener(
                    markerInstance,
                    "dragstart",
                    () => onDragStart(markerInstance)
                );
            }

            if (onDragEnd) {
                window.kakao.maps.event.addListener(
                    markerInstance,
                    "dragend",
                    () => onDragEnd(markerInstance)
                );
            }

            if (clusterer) {
                // 클러스터러가 있는 경우 클러스터러에 마커 추가
                clusterer.addMarker(markerInstance);
            } else {
                // 클러스터러가 없는 경우 지도에 직접 마커 추가
                markerInstance.setMap(map);
            }

            setMarker(markerInstance);

            return () => {
                if (clusterer) {
                    clusterer.removeMarker(markerInstance);
                }
                markerInstance.setMap(null);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            map,
            position,
            title,
            clickable,
            draggable,
            opacity,
            visible,
            zIndex,
        ]);

        // 두 번째 useEffect 제거 - 위의 첫 번째 useEffect에서 모든 속성을 설정

        // 자식 컴포넌트 메모이제이션
        const memoizedChildren = useMemo(
            () =>
                Children.map(children, (child) => {
                    if (!isValidElement(child)) return child;
                    return cloneElement(child as React.ReactElement<any>, {
                        marker,
                    });
                }),
            [children, marker]
        );

        // 자식 컴포넌트에 마커 전달
        if (!marker || !children) return null;

        return <>{memoizedChildren}</>;
    }
);
