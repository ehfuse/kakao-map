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

import React, { useEffect, useRef, useState } from "react";
import { parsePosition } from "./utils";
import { MapContext } from "./hook/useKakaoLoader";
import { MapProps, KakaoMap, KakaoClusterer, MapState } from "./types";

/**
 * Map 컴포넌트
 */
export const Map: React.FC<MapProps> = ({
    center,
    children,
    style,
    width = "100%", // 기본 너비를 100%로 설정
    height = 500, // 기본 높이를 500px로 설정
    className,
    level = 3,
    maxLevel,
    minLevel,
    draggable = true,
    wheelZoom = true,
    disableDoubleClick,
    disableDoubleClickZoom,
    keyboardShortcuts = true,
    tileAnimation = true,
    mapTypeId = "ROADMAP",
    closeInfoWindowOnClick = false,
    onCreate,
    onClick,
    onRightClick,
    onDoubleClick,
    onMouseMove,
    onDragStart,
    onDragEnd,
    onZoomChanged,
    onIdle,
    onTilesLoaded,
    onBoundsChanged,
    onCenterChanged,
    onProjectionChanged,
    apiKey,
    mapTypeControl = false,
    mapTypeControlPosition,
    zoomControl = false,
    zoomControlPosition,
    roadView = false,
    traffic = false,
    terrain = false,
    clusterer = false,
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<KakaoMap | null>(null);
    const [clustererInstance, setClustererInstance] =
        useState<KakaoClusterer | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<any>(null);
    const isUnmountingRef = useRef<boolean>(false);

    // Map 내부 상태 관리
    // props로 받은 값을 내부 상태로 관리 (필요시 확장 가능)
    const [mapState] = useState<MapState>({
        level,
        zoomControl,
        zoomControlPosition,
        mapTypeControl,
        mapTypeControlPosition,
        draggable,
        wheelZoom,
        traffic,
        terrain,
    });

    // 카카오맵 로드와 초기화
    useEffect(() => {
        const loadKakaoMap = async () => {
            // 이미 스크립트가 로드되었는지 확인
            if (window.kakao && window.kakao.maps) {
                initializeMap();
                return;
            }

            // 이미 스크립트가 추가되었는지 확인 (dapi.kakao.com 또는 kakao.maps.sdk 포함)
            const script = document.querySelector(
                'script[src*="dapi.kakao.com"], script[src*="kakao.maps.sdk"]'
            );
            if (script) {
                // 스크립트 로드 완료 대기
                const waitForKakao = setInterval(() => {
                    if (window.kakao && window.kakao.maps) {
                        clearInterval(waitForKakao);
                        initializeMap();
                    }
                }, 100);
                return;
            }

            // apiKey가 제공되지 않고 스크립트도 없는 경우에만 에러
            if (!apiKey) {
                console.error(
                    "카카오맵 API 키가 필요합니다. " +
                        "index.html에 스크립트를 추가하거나 apiKey prop을 전달해주세요."
                );
                return;
            }

            // 스크립트 생성 및 로드
            const mapScript = document.createElement("script");
            mapScript.async = true;
            const libraries = ["services", "drawing"];
            if (clusterer) {
                libraries.push("clusterer");
            }
            mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=${libraries.join(
                ","
            )}`;

            mapScript.onload = () => {
                window.kakao.maps.load(() => {
                    initializeMap();
                });
            };

            document.head.appendChild(mapScript);
        };

        loadKakaoMap();

        return () => {
            // 언마운트 플래그 설정 - 자식 마커들이 개별 cleanup을 스킵하도록
            isUnmountingRef.current = true;

            // 컴포넌트 언마운트 시 정리
            // 클러스터러만 정리 - setMap(null)은 리렌더링을 유발하므로 제거
            if (clustererInstance) {
                try {
                    // 클러스터러의 모든 마커를 한 번에 정리
                    clustererInstance.clear();
                } catch (e) {
                    // 에러 무시
                }
            }

            // setMap(null) 제거:
            // - 이미 isUnmountingRef로 자식 마커들의 cleanup이 스킵됨
            // - 언마운트 시 불필요한 리렌더링 방지
            // - 브라우저가 DOM을 정리할 것임
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey, wheelZoom]);

    // 맵 초기화 함수
    const initializeMap = () => {
        if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

        try {
            console.debug("지도 초기화 시작");
            // 지도 옵션 설정
            const kakaoPosition = parsePosition(center);
            if (!kakaoPosition) {
                console.error("좌표 변환 실패");
                return;
            }

            const options: any = {
                center: kakaoPosition,
                level,
                draggable,
                scrollwheel: wheelZoom, // 마우스 휠 줌 제어
                tileAnimation,
            };

            // 추가 옵션 설정
            if (maxLevel !== undefined) options.maxLevel = maxLevel;
            if (minLevel !== undefined) options.minLevel = minLevel;
            if (disableDoubleClick !== undefined)
                options.disableDoubleClick = disableDoubleClick;
            if (disableDoubleClickZoom !== undefined)
                options.disableDoubleClickZoom = disableDoubleClickZoom;

            // 키보드 단축키 옵션 설정
            if (typeof keyboardShortcuts === "object") {
                options.keyboardShortcuts = keyboardShortcuts;
            } else {
                options.keyboardShortcuts = !!keyboardShortcuts;
            }

            // 지도 생성
            const mapInstance = new window.kakao.maps.Map(
                mapRef.current,
                options
            );

            // 위치 문자열을 카카오 ControlPosition으로 변환하는 헬퍼 함수
            const getControlPosition = (position?: string) => {
                switch (position) {
                    case "TOPLEFT":
                        return window.kakao.maps.ControlPosition.TOPLEFT;
                    case "TOP":
                        return window.kakao.maps.ControlPosition.TOP;
                    case "TOPRIGHT":
                        return window.kakao.maps.ControlPosition.TOPRIGHT;
                    case "LEFT":
                        return window.kakao.maps.ControlPosition.LEFT;
                    case "CENTER":
                        return window.kakao.maps.ControlPosition.CENTER;
                    case "RIGHT":
                        return window.kakao.maps.ControlPosition.RIGHT;
                    case "BOTTOMLEFT":
                        return window.kakao.maps.ControlPosition.BOTTOMLEFT;
                    case "BOTTOM":
                        return window.kakao.maps.ControlPosition.BOTTOM;
                    case "BOTTOMRIGHT":
                        return window.kakao.maps.ControlPosition.BOTTOMRIGHT;
                    default:
                        return window.kakao.maps.ControlPosition.TOPRIGHT;
                }
            };

            // 지도 타입 컨트롤 설정
            if (mapTypeControl) {
                const position = getControlPosition(mapTypeControlPosition);
                mapInstance.addControl(
                    new (window.kakao.maps as any).MapTypeControl(),
                    position
                );
            }

            // 확대/축소 컨트롤 설정
            if (zoomControl) {
                const position = getControlPosition(zoomControlPosition);
                mapInstance.addControl(
                    new (window.kakao.maps as any).ZoomControl(),
                    position
                );
            }

            // 로드뷰 레이어 추가
            if (roadView) {
                mapInstance.addOverlayMapTypeId(
                    window.kakao.maps.MapTypeId.ROADVIEW
                );
            }

            // 교통정보 레이어 추가
            if (traffic) {
                mapInstance.addOverlayMapTypeId(
                    window.kakao.maps.MapTypeId.TRAFFIC
                );
            }

            // 지형정보 레이어 추가
            if (terrain) {
                mapInstance.addOverlayMapTypeId(
                    window.kakao.maps.MapTypeId.TERRAIN
                );
            }

            // 지도 타입 설정
            mapInstance.setMapTypeId(window.kakao.maps.MapTypeId[mapTypeId]);

            // 이벤트 리스너 등록
            if (onClick || closeInfoWindowOnClick) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "click",
                    (mouseEvent: any) => {
                        // 마커나 오버레이를 클릭한 경우 Map의 onClick을 무시
                        // target이 존재하면 마커/오버레이 클릭으로 간주
                        if (mouseEvent.target) {
                            return;
                        }

                        // closeInfoWindowOnClick이 true면 선택된 마커를 null로 설정
                        if (closeInfoWindowOnClick) {
                            setSelectedMarker(null);
                        }

                        // onClick 콜백 호출
                        if (onClick) {
                            onClick(mouseEvent, mapInstance);
                        }
                    }
                );
            }

            // 마커 클러스터 생성
            let newClustererInstance: any = null;
            if (
                clusterer &&
                window.kakao.maps &&
                window.kakao.maps.MarkerClusterer
            ) {
                newClustererInstance = new window.kakao.maps.MarkerClusterer({
                    map: mapInstance,
                    averageCenter: true,
                    minLevel: 5,
                });
                setClustererInstance(newClustererInstance);
            }

            if (onRightClick) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "rightclick",
                    (mouseEvent: any) => {
                        onRightClick(mouseEvent, mapInstance);
                    }
                );
            }

            if (onDoubleClick) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "dblclick",
                    (mouseEvent: any) => {
                        onDoubleClick(mouseEvent, mapInstance);
                    }
                );
            }

            if (onMouseMove) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "mousemove",
                    (mouseEvent: any) => {
                        onMouseMove(mouseEvent, mapInstance);
                    }
                );
            }

            if (onDragStart) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "dragstart",
                    () => {
                        onDragStart(mapInstance);
                    }
                );
            }

            if (onDragEnd) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "dragend",
                    () => {
                        onDragEnd(mapInstance);
                    }
                );
            }

            if (onZoomChanged) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "zoom_changed",
                    () => {
                        onZoomChanged(mapInstance);
                    }
                );
            }

            if (onIdle) {
                window.kakao.maps.event.addListener(mapInstance, "idle", () => {
                    onIdle(mapInstance);
                });
            }

            if (onTilesLoaded) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "tilesloaded",
                    () => {
                        onTilesLoaded(mapInstance, newClustererInstance);
                    }
                );
            }

            if (onBoundsChanged) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "bounds_changed",
                    () => {
                        onBoundsChanged(mapInstance);
                    }
                );
            }

            if (onCenterChanged) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "center_changed",
                    () => {
                        onCenterChanged(mapInstance);
                    }
                );
            }

            if (onProjectionChanged) {
                window.kakao.maps.event.addListener(
                    mapInstance,
                    "projection_changed",
                    () => {
                        onProjectionChanged(mapInstance);
                    }
                );
            }

            setMap(mapInstance);

            // 생성 콜백
            if (onCreate) {
                onCreate(mapInstance, newClustererInstance);
            }

            console.debug("지도 생성 완료");
        } catch (error) {
            console.error("지도 초기화 중 오류 발생:", error);
        }
    };

    // 지도 옵션 업데이트
    useEffect(() => {
        if (!map || !window.kakao || !window.kakao.maps) return;

        try {
            // 센터 업데이트
            const kakaoPosition = parsePosition(center);
            if (kakaoPosition) {
                map.setCenter(kakaoPosition);
            }

            // 레벨 업데이트
            if (map.getLevel() !== level) {
                map.setLevel(level);
            }

            // 다른 옵션 업데이트
            map.setDraggable(draggable);

            // 지도 타입 업데이트
            map.setMapTypeId(window.kakao.maps.MapTypeId[mapTypeId]);
        } catch (error) {
            console.error("지도 옵션 업데이트 중 오류:", error);
        }
    }, [map, center, level, draggable, wheelZoom, mapTypeId]);

    // 오버레이 레이어 토글
    useEffect(() => {
        if (!map || !window.kakao || !window.kakao.maps) return;

        try {
            // 교통정보 레이어 토글
            if (traffic) {
                map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);
            } else {
                map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);
            }

            // 지형정보 레이어 토글
            if (terrain) {
                map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TERRAIN);
            } else {
                map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TERRAIN);
            }

            // 로드뷰 레이어 토글
            if (roadView) {
                map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
            } else {
                map.removeOverlayMapTypeId(
                    window.kakao.maps.MapTypeId.ROADVIEW
                );
            }
        } catch (error) {
            console.error("오버레이 레이어 업데이트 중 오류:", error);
        }
    }, [map, traffic, terrain, roadView]);

    // width, height를 style에 병합
    const mergedStyle = React.useMemo(() => {
        const baseStyle = { ...style };
        if (width !== undefined) {
            baseStyle.width = typeof width === "number" ? `${width}px` : width;
        }
        if (height !== undefined) {
            baseStyle.height =
                typeof height === "number" ? `${height}px` : height;
        }
        return baseStyle;
    }, [style, width, height]);

    return (
        <div ref={mapRef} className={className} style={mergedStyle}>
            {map && (
                <MapContext.Provider
                    value={{
                        map,
                        clusterer: clustererInstance,
                        isUnmountingRef,
                        selectedMarker,
                        setSelectedMarker,
                    }}
                >
                    {children}
                </MapContext.Provider>
            )}
        </div>
    );
};
