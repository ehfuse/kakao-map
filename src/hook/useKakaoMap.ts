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

import { useCallback, useContext, useMemo } from "react";
import { useGlobalFormaState } from "@ehfuse/forma";
import {
    KakaoPosition,
    KakaoMarker,
    KakaoSearchResult,
    MapState,
} from "../types";
import { MapContext } from "./useKakaoLoader";

/**
 * useKakaoMap 옵션
 */
export interface UseKakaoMapOptions<T extends MapState = MapState> {
    /**
     * 상태 관리를 위한 고유 ID
     * 같은 stateId를 사용하는 컴포넌트들은 상태를 공유합니다
     */
    stateId?: string;

    /**
     * 초기 상태 값
     */
    initialValues?: Partial<T>;
}

/**
 * Kakao Maps API를 쉽게 사용하기 위한 All-in-One 커스텀 훅
 *
 * 이 훅은 Kakao Maps의 모든 기능을 React스럽게 사용할 수 있도록 제공합니다:
 * - 좌표 변환 및 계산
 * - 마커 생성 및 관리
 * - 주소 검색 (지오코딩)
 * - 장소 검색
 * - 역지오코딩 (좌표 → 주소)
 * - forma 기반 상태 관리 (선택적)
 *
 * @example
 * ```tsx
 * // 기본 사용 (상태 관리 없이)
 * function MyComponent() {
 *   const kakao = useKakaoMap();
 *
 *   // API 로드 상태 확인
 *   if (!kakao.isReady) return <div>로딩 중...</div>;
 *
 *   // 주소 검색
 *   const handleSearch = async () => {
 *     const result = await kakao.searchAddress("서울시청");
 *     console.log(result.lat, result.lng);
 *   };
 * }
 *
 * // 상태 관리와 함께 사용
 * function MyComponent() {
 *   const { isReady, searchAddress, state } = useKakaoMap({
 *     stateId: "my-map",
 *     initialValues: {
 *       center: { lat: 37.5665, lng: 126.978 },
 *       level: 3
 *     }
 *   });
 *
 *   const center = state.useValue("center");
 *
 *   const handleMove = () => {
 *     state.setValue("center", { lat: 37.5, lng: 127.0 });
 *   };
 * }
 * ```
 */
export const useKakaoMap = <T extends MapState = MapState>(
    options?: UseKakaoMapOptions<T>
) => {
    // Map 인스턴스 가져오기 (MapContext에서)
    // Map 컴포넌트 내부에서 사용할 경우에만 사용 가능
    const map = useContext(MapContext);

    // Kakao Maps API 로드 상태 확인
    const isReady = useMemo(() => {
        return !!(
            window.kakao &&
            window.kakao.maps &&
            window.kakao.maps.services
        );
    }, []);

    // 상태 관리 (옵션)
    const state = useGlobalFormaState<T>({
        stateId: options?.stateId || "kakao-map-default",
        initialValues: options?.initialValues || ({} as T),
    });

    /**
     * 좌표 변환 함수
     */
    const parsePosition = useCallback((position: KakaoPosition) => {
        if (!window.kakao || !window.kakao.maps) {
            console.warn("Kakao Maps API가 아직 로드되지 않았습니다.");
            return null;
        }

        if ("lat" in position && "lng" in position) {
            return new window.kakao.maps.LatLng(position.lat, position.lng);
        }
        return new window.kakao.maps.Coords(position.x, position.y);
    }, []);

    /**
     * 마커 생성 함수
     */
    const createMarker = useCallback(
        (
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
            if (!window.kakao || !window.kakao.maps) {
                console.error("Kakao Maps API가 로드되지 않았습니다.");
                return null;
            }

            const markerPosition = parsePosition(position);
            if (!markerPosition) {
                console.error("마커 위치 변환 실패", position);
                return null;
            }

            const markerOptions: {
                position: unknown;
                title?: string;
                clickable?: boolean;
                draggable?: boolean;
                zIndex?: number;
                opacity?: number;
                image?: unknown;
            } = {
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new window.kakao.maps.Marker(markerOptions as any);
        },
        [parsePosition]
    );

    /**
     * 두 좌표 사이의 직선 거리 계산 (미터 단위)
     * Haversine 공식 사용
     */
    const getDistance = useCallback(
        (pos1: KakaoPosition, pos2: KakaoPosition): number => {
            const lat1 = "lat" in pos1 ? pos1.lat : 0;
            const lng1 = "lng" in pos1 ? pos1.lng : 0;
            const lat2 = "lat" in pos2 ? pos2.lat : 0;
            const lng2 = "lng" in pos2 ? pos2.lng : 0;

            const R = 6371e3; // 지구 반지름 (미터)
            const φ1 = (lat1 * Math.PI) / 180;
            const φ2 = (lat2 * Math.PI) / 180;
            const Δφ = ((lat2 - lat1) * Math.PI) / 180;
            const Δλ = ((lng2 - lng1) * Math.PI) / 180;

            const a =
                Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) *
                    Math.cos(φ2) *
                    Math.sin(Δλ / 2) *
                    Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c; // 미터 단위 거리
        },
        []
    );

    /**
     * 주소 검색 함수 (Promise 기반)
     */
    const searchAddress = useCallback(
        (address: string): Promise<KakaoSearchResult> => {
            return new Promise((resolve, reject) => {
                if (
                    !window.kakao ||
                    !window.kakao.maps ||
                    !window.kakao.maps.services
                ) {
                    reject(new Error("Kakao Maps API가 로드되지 않았습니다."));
                    return;
                }

                const geocoder = new window.kakao.maps.services.Geocoder();

                geocoder.addressSearch(
                    address,
                    (result: unknown, status: unknown) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const resultArray = result as Array<{
                                x: string;
                                y: string;
                                address_name: string;
                                address: { address_name: string };
                                road_address?: { address_name: string };
                            }>;

                            if (resultArray && resultArray.length > 0) {
                                const firstResult = resultArray[0];
                                resolve({
                                    address:
                                        firstResult.address_name ||
                                        firstResult.address.address_name,
                                    roadAddress:
                                        firstResult.road_address?.address_name,
                                    lat: parseFloat(firstResult.y),
                                    lng: parseFloat(firstResult.x),
                                });
                            } else {
                                reject(new Error("검색 결과가 없습니다."));
                            }
                        } else if (
                            status ===
                            window.kakao.maps.services.Status.ZERO_RESULT
                        ) {
                            reject(
                                new Error(
                                    "검색 결과가 없습니다. 주소를 확인해주세요."
                                )
                            );
                        } else {
                            reject(
                                new Error("주소 검색 중 오류가 발생했습니다.")
                            );
                        }
                    }
                );
            });
        },
        []
    );

    /**
     * 키워드로 장소 검색 함수 (Promise 기반)
     */
    const searchPlace = useCallback(
        (keyword: string): Promise<KakaoSearchResult[]> => {
            return new Promise((resolve, reject) => {
                if (
                    !window.kakao ||
                    !window.kakao.maps ||
                    !window.kakao.maps.services
                ) {
                    reject(new Error("Kakao Maps API가 로드되지 않았습니다."));
                    return;
                }

                const places = new window.kakao.maps.services.Places();

                places.keywordSearch(
                    keyword,
                    (result: unknown, status: unknown) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const resultArray = result as Array<{
                                x: string;
                                y: string;
                                place_name: string;
                                address_name: string;
                                road_address_name?: string;
                                category_group_code?: string;
                                id?: string;
                            }>;

                            const searchResults: KakaoSearchResult[] =
                                resultArray.map((item) => ({
                                    address: item.address_name,
                                    roadAddress: item.road_address_name,
                                    placeName: item.place_name,
                                    placeType: item.category_group_code,
                                    placeId: item.id,
                                    lat: parseFloat(item.y),
                                    lng: parseFloat(item.x),
                                }));

                            resolve(searchResults);
                        } else if (
                            status ===
                            window.kakao.maps.services.Status.ZERO_RESULT
                        ) {
                            reject(new Error("검색 결과가 없습니다."));
                        } else {
                            reject(
                                new Error("장소 검색 중 오류가 발생했습니다.")
                            );
                        }
                    }
                );
            });
        },
        []
    );

    /**
     * 좌표로 주소 검색 (역지오코딩)
     * 주의: Kakao Maps API의 좌표→주소 변환은 제한적입니다
     */
    const coord2Address = useCallback(
        (
            position: KakaoPosition
        ): Promise<{
            address: string;
            roadAddress?: string;
        }> => {
            return new Promise((resolve, reject) => {
                if (
                    !window.kakao ||
                    !window.kakao.maps ||
                    !window.kakao.maps.services
                ) {
                    reject(new Error("Kakao Maps API가 로드되지 않았습니다."));
                    return;
                }

                const geocoder = new window.kakao.maps.services.Geocoder();
                const lat = "lat" in position ? position.lat : 0;
                const lng = "lng" in position ? position.lng : 0;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (geocoder as any).coord2Address(
                    lng,
                    lat,
                    (result: unknown, status: unknown) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const resultArray = result as Array<{
                                address: { address_name: string };
                                road_address?: { address_name: string };
                            }>;

                            if (resultArray && resultArray.length > 0) {
                                resolve({
                                    address:
                                        resultArray[0].address.address_name,
                                    roadAddress:
                                        resultArray[0].road_address
                                            ?.address_name,
                                });
                            } else {
                                reject(new Error("주소를 찾을 수 없습니다."));
                            }
                        } else {
                            reject(
                                new Error(
                                    "좌표를 주소로 변환하는 중 오류가 발생했습니다."
                                )
                            );
                        }
                    }
                );
            });
        },
        []
    );

    /**
     * Geocoder 인스턴스 직접 접근 (고급 사용자용)
     */
    const getGeocoder = useCallback(() => {
        if (
            !window.kakao ||
            !window.kakao.maps ||
            !window.kakao.maps.services
        ) {
            console.error("Kakao Maps API가 로드되지 않았습니다.");
            return null;
        }
        return new window.kakao.maps.services.Geocoder();
    }, []);

    /**
     * Places 인스턴스 직접 접근 (고급 사용자용)
     */
    const getPlaces = useCallback(() => {
        if (
            !window.kakao ||
            !window.kakao.maps ||
            !window.kakao.maps.services
        ) {
            console.error("Kakao Maps API가 로드되지 않았습니다.");
            return null;
        }
        return new window.kakao.maps.services.Places();
    }, []);

    return {
        // API 로드 상태
        isReady,

        // Map 인스턴스 (MapContext에서 제공, Map 컴포넌트 내부에서만 사용 가능)
        map,

        // 상태 관리 (forma)
        state,

        // 좌표 관련
        parsePosition, // 좌표 변환
        getDistance, // 두 좌표 사이 거리 계산

        // 마커 생성
        createMarker, // 마커 생성 (옵션 포함)

        // 검색 함수 (모두 Promise 기반)
        searchAddress, // 주소 → 좌표
        searchPlace, // 키워드로 장소 검색
        coord2Address, // 좌표 → 주소 (역지오코딩)

        // 고급 사용자를 위한 직접 접근
        getGeocoder, // Geocoder 인스턴스
        getPlaces, // Places 인스턴스
    };
};
