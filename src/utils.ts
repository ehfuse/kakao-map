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

import { ReactElement } from "react";
import { KakaoSearchResult, KakaoPosition, KakaoMarker } from "./types";

/**
 * React 엘리먼트를 HTML 문자열로 변환 (간단한 구조만 지원)
 */
function reactElementToString(element: ReactElement): string {
    if (!element) return "";

    const { type, props } = element;

    // 함수형 컴포넌트인 경우 실행하여 실제 JSX 얻기
    if (typeof type === "function") {
        try {
            // 함수형 컴포넌트를 실행
            const Component = type as (props: any) => ReactElement;
            const renderedElement = Component(props);
            return reactElementToString(renderedElement);
        } catch (error) {
            console.error("컴포넌트 렌더링 실패:", error);
            return "";
        }
    }

    const { children, ...attrs } = props || {};

    // 태그 이름
    const tagName = typeof type === "string" ? type : "svg";

    // SVG 속성 매핑 (camelCase -> kebab-case)
    const svgAttrMap: Record<string, string> = {
        textAnchor: "text-anchor",
        fontSize: "font-size",
        fontFamily: "font-family",
        fontWeight: "font-weight",
        fontStyle: "font-style",
        viewBox: "viewBox", // viewBox는 그대로 유지
        xmlns: "xmlns",
    };

    // 속성 문자열 생성
    const attrString = Object.keys(attrs)
        .filter(
            (key) =>
                attrs[key] !== undefined && attrs[key] !== null && key !== "key"
        )
        .map((key) => {
            const value = attrs[key];
            // SVG 속성 매핑 확인
            const attrName = svgAttrMap[key] || key;

            // boolean 값 처리
            if (typeof value === "boolean") {
                return value ? attrName : "";
            }

            return `${attrName}="${String(value).replace(/"/g, "&quot;")}"`;
        })
        .filter(Boolean)
        .join(" ");

    // 자식 요소 처리
    let childrenString = "";
    if (children) {
        if (Array.isArray(children)) {
            childrenString = children
                .map((child) => {
                    if (
                        typeof child === "string" ||
                        typeof child === "number"
                    ) {
                        return String(child);
                    }
                    if (child && typeof child === "object" && "type" in child) {
                        return reactElementToString(child as ReactElement);
                    }
                    return "";
                })
                .join("");
        } else if (
            typeof children === "string" ||
            typeof children === "number"
        ) {
            childrenString = String(children);
        } else if (
            children &&
            typeof children === "object" &&
            "type" in children
        ) {
            childrenString = reactElementToString(children as ReactElement);
        }
    }

    return `<${tagName}${
        attrString ? " " + attrString : ""
    }>${childrenString}</${tagName}>`;
}

/**
 * React SVG 엘리먼트를 Data URL로 변환 (브라우저 환경)
 * @param svgElement React SVG 엘리먼트
 * @returns Data URL 문자열
 *
 * @example
 * ```tsx
 * const svgIcon = (
 *   <svg width="36" height="36" viewBox="0 0 24 24">
 *     <circle cx="12" cy="12" r="10" fill="blue" />
 *   </svg>
 * );
 *
 * const dataUrl = reactSvgToDataUrl(svgIcon);
 * ```
 */
export const reactSvgToDataUrl = (svgElement: ReactElement): string => {
    const svgString = reactElementToString(svgElement);
    return `data:image/svg+xml;base64,${btoa(
        unescape(encodeURIComponent(svgString))
    )}`;
};

/**
 * SVG 문자열을 Data URL로 변환
 * @param svgString SVG 문자열
 * @returns Data URL 문자열
 *
 * @example
 * ```tsx
 * const svgString = '<svg width="36" height="36"><circle cx="18" cy="18" r="10" fill="red" /></svg>';
 * const dataUrl = svgStringToDataUrl(svgString);
 * ```
 */
export const svgStringToDataUrl = (svgString: string): string => {
    return `data:image/svg+xml;base64,${btoa(
        unescape(encodeURIComponent(svgString))
    )}`;
};

// 유틸리티 함수 - 안전한 좌표 변환
export const parsePosition = (position: KakaoPosition) => {
    // Kakao Maps API가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
        console.debug(
            "카카오맵 API가 로드되지 않았습니다. 잠시 후 다시 시도하세요."
        );
        return;
    }

    if ("lat" in position && "lng" in position) {
        return new window.kakao.maps.LatLng(position.lat, position.lng);
    }
    return new window.kakao.maps.Coords(position.x, position.y);
};

/**
 * 카카오 마커 생성 유틸 함수
 * @param position 마커 위치 (lat, lng 또는 x, y)
 * @param options 마커 옵션 (title, clickable, draggable 등)
 * @returns KakaoMarker 인스턴스 또는 null
 */
export const createKakaoMarker = (
    position: KakaoPosition,
    options?: {
        title?: string;
        clickable?: boolean;
        draggable?: boolean;
        zIndex?: number;
        opacity?: number;
        image?: {
            src: string;
            size: { width: number; height: number };
            options?: {
                offset?: { x: number; y: number };
            };
        };
    }
): KakaoMarker | null => {
    // Kakao Maps API가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
        console.error("createKakaoMarker: 카카오맵 API가 로드되지 않았습니다.");
        return null;
    }

    const markerPosition = parsePosition(position);
    if (!markerPosition) {
        console.error("createKakaoMarker: 마커 위치 변환 실패", position);
        return null;
    }

    const markerOptions: any = {
        position: markerPosition,
        ...options,
    };

    // 이미지 옵션 처리
    if (options?.image) {
        const imageSize = new window.kakao.maps.Size(
            options.image.size.width,
            options.image.size.height
        );

        if (options.image.options?.offset) {
            const offset = new window.kakao.maps.Point(
                options.image.options.offset.x,
                options.image.options.offset.y
            );
            markerOptions.image = new window.kakao.maps.MarkerImage(
                options.image.src,
                imageSize,
                { offset }
            );
        } else {
            markerOptions.image = new window.kakao.maps.MarkerImage(
                options.image.src,
                imageSize
            );
        }
    }

    return new window.kakao.maps.Marker(markerOptions);
};

/**
 * 주소 또는 태그 검색 함수
 * @param address 검색할 주소 또는 태그
 * @param onSuccess 검색 성공 시 호출될 콜백 함수
 * @param onError 검색 실패 시 호출될 콜백 함수
 */
export const searchAddress = (
    address: string,
    onSuccess: (result: KakaoSearchResult) => void,
    onError?: (error: string) => void
) => {
    // Kakao Maps API가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        if (onError)
            onError(
                "카카오맵 API가 로드되지 않았습니다. 잠시 후 다시 시도하세요."
            );
        return;
    }

    // 주소 및 태그 검색 서비스 객체 생성
    const geocoder = new window.kakao.maps.services.Geocoder();
    const places = new window.kakao.maps.services.Places();

    // 1. 먼저 정확한 주소 검색 시도
    geocoder.addressSearch(address, (result: any, status: any) => {
        if (
            status === window.kakao.maps.services.Status.OK &&
            result &&
            result.length > 0
        ) {
            // 주소 검색 성공
            handleSearchResult(result[0], result[0].address_name);
        } else {
            // 2. 정확한 주소 검색 실패시 유사 주소 검색 시도
            console.debug(
                "정확한 주소 검색 실패, 유사 주소 검색 시도...",
                address
            );
            tryAlternativeSearch(address);
        }
    });

    // 대안 검색 함수 (번지수 조정 + 부분 주소 검색)
    const tryAlternativeSearch = (originalAddress: string) => {
        let foundResult = false;

        // 1단계: 번지수 전후 검색
        const tryNearbyNumbers = () => {
            // 주소에서 마지막 숫자(번지수) 추출
            const numberMatch = originalAddress.match(/(\d+)(?=\D*$)/);

            if (numberMatch) {
                const originalNumber = parseInt(numberMatch[0]);
                const baseAddress = originalAddress.replace(
                    /\d+(?=\D*$)/,
                    "{NUMBER}"
                );
                let searchIndex = 0;
                const searchRange = [-2, -1, 1, 2]; // 전후 2자리씩

                const searchNearbyNumber = () => {
                    if (foundResult || searchIndex >= searchRange.length) {
                        // 번지수 검색 실패시 부분 주소 검색으로 넘어감
                        tryPartialAddressSearch();
                        return;
                    }

                    const targetNumber =
                        originalNumber + searchRange[searchIndex];
                    if (targetNumber > 0) {
                        // 음수 번지수는 제외
                        const testAddress = baseAddress.replace(
                            "{NUMBER}",
                            targetNumber.toString()
                        );

                        geocoder.addressSearch(
                            testAddress,
                            (result: any, status: any) => {
                                if (
                                    status ===
                                        window.kakao.maps.services.Status.OK &&
                                    result &&
                                    result.length > 0
                                ) {
                                    // 인근 번지수 검색 성공
                                    foundResult = true;
                                    handleSearchResult(
                                        result[0],
                                        originalAddress + ` (${testAddress})`
                                    );
                                } else {
                                    // 다음 번지수 검색
                                    searchIndex++;
                                    searchNearbyNumber();
                                }
                            }
                        );
                    } else {
                        searchIndex++;
                        searchNearbyNumber();
                    }
                };

                searchNearbyNumber();
            } else {
                // 번지수가 없으면 바로 부분 주소 검색
                tryPartialAddressSearch();
            }
        };

        // 2단계: 부분 주소 검색 (기존 방식)
        const tryPartialAddressSearch = () => {
            if (foundResult) return;

            const addressParts = originalAddress.split(" ");

            const searchPartial = (index: number) => {
                if (foundResult || index < 2) {
                    // 부분 주소 검색도 실패하면 키워드 검색 시도
                    if (!foundResult) {
                        tryKeywordSearch();
                    }
                    return;
                }

                const partialAddress = addressParts.slice(0, index).join(" ");

                geocoder.addressSearch(
                    partialAddress,
                    (result: any, status: any) => {
                        if (
                            status === window.kakao.maps.services.Status.OK &&
                            result &&
                            result.length > 0
                        ) {
                            // 부분 주소 검색 성공
                            foundResult = true;
                            handleSearchResult(
                                result[0],
                                originalAddress + " (유사지역)"
                            );
                        } else {
                            // 다음 단계 검색 시도
                            searchPartial(index - 1);
                        }
                    }
                );
            };

            // 끝에서부터 단계적으로 검색
            searchPartial(addressParts.length - 1);
        };

        // 3단계: 키워드 검색
        const tryKeywordSearch = () => {
            if (foundResult) return;

            places.keywordSearch(
                originalAddress,
                (placeResults: any, placeStatus: any) => {
                    if (
                        placeStatus === window.kakao.maps.services.Status.OK &&
                        placeResults &&
                        placeResults.length > 0
                    ) {
                        // 키워드 검색 성공
                        handleSearchResult(
                            placeResults[0],
                            placeResults[0].place_name
                        );
                    } else {
                        // 모든 검색 실패
                        if (onError)
                            onError(
                                "검색 결과가 없습니다. 다른 주소나 장소명으로 시도해보세요."
                            );
                    }
                }
            );
        };

        // 번지수 검색부터 시작
        tryNearbyNumbers();
    };

    // 검색 결과 처리 핸들러
    const handleSearchResult = (result: any, title: string) => {
        const coords = {
            lat: parseFloat(result.y),
            lng: parseFloat(result.x),
        };

        // 검색 결과 객체 생성
        const searchResult: KakaoSearchResult = {
            address: title,
            ...coords,
        };

        // 추가 정보 (있을 경우)
        if (result.place_name) searchResult.placeName = result.place_name;
        if (result.category_group_code)
            searchResult.placeType = result.category_group_code;
        if (result.id) searchResult.placeId = result.id;
        if (result.road_address_name)
            searchResult.roadAddress = result.road_address_name;

        // 성공 콜백 호출
        onSuccess(searchResult);
    };
};
