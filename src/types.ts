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

import { ReactNode } from "react";

export interface MapState {
    center?: KakaoLatLng;
    level?: number;
    markerPosition?: KakaoLatLng;
    zoomControl?: boolean;
    zoomControlPosition?: KakaoControlPosition;
    mapTypeControl?: boolean;
    mapTypeControlPosition?: KakaoControlPosition;
    draggable?: boolean;
    wheelZoom?: boolean;
    traffic?: boolean;
    terrain?: boolean;
}

// Kakao Maps API 인스턴스 타입 정의
export interface KakaoMap {
    setCenter(position: KakaoLatLngInstance): void;
    getCenter(): KakaoLatLngInstance;
    setLevel(level: number, options?: { animate?: boolean }): void;
    getLevel(): number;
    setMapTypeId(mapTypeId: unknown): void;
    setDraggable(draggable: boolean): void;
    setZoomable(zoomable: boolean): void;
    addControl(control: unknown, position: unknown): void;
    addOverlayMapTypeId(mapTypeId: unknown): void;
    removeOverlayMapTypeId(mapTypeId: unknown): void;
    relayout(): void;
    panTo(position: KakaoLatLngInstance): void;
}

export interface KakaoLatLngInstance {
    getLat(): number;
    getLng(): number;
}

export interface KakaoMarker {
    setMap(map: KakaoMap | null): void;
    getMap(): KakaoMap | null;
    setPosition(position: KakaoLatLngInstance): void;
    getPosition(): KakaoLatLngInstance;
    setImage(image: KakaoMarkerImage): void;
    setDraggable(draggable: boolean): void;
    setClickable(clickable: boolean): void;
    setZIndex(zIndex: number): void;
    setOpacity(opacity: number): void;
    setVisible(visible: boolean): void;
}

export interface KakaoMarkerImage {
    // MarkerImage methods
}

export interface KakaoSize {
    // Size properties
}

export interface KakaoPointInstance {
    // Point instance properties
}

export interface KakaoMouseEvent {
    latLng: KakaoLatLngInstance;
    point: KakaoPointInstance;
}

export interface KakaoClusterer {
    addMarker(marker: KakaoMarker): void;
    addMarkers(markers: KakaoMarker[]): void;
    removeMarker(marker: KakaoMarker): void;
    removeMarkers(markers: KakaoMarker[]): void;
    clear(): void;
}

export interface KakaoGeocoder {
    addressSearch(
        address: string,
        callback: (result: KakaoGeocoderResult[], status: string) => void
    ): void;
}

export interface KakaoPlaces {
    keywordSearch(
        keyword: string,
        callback: (result: KakaoPlaceResult[], status: string) => void
    ): void;
}

export interface KakaoGeocoderResult {
    address_name: string;
    road_address_name?: string;
    x: string;
    y: string;
}

export interface KakaoPlaceResult {
    place_name: string;
    address_name: string;
    road_address_name?: string;
    x: string;
    y: string;
    id?: string;
    category_group_code?: string;
}

// Kakao API 타입 정의 개선
declare global {
    interface Window {
        kakao: {
            maps: {
                MarkerClusterer: new (options: {
                    map: KakaoMap;
                    averageCenter?: boolean;
                    minLevel?: number;
                }) => KakaoClusterer;
                ControlPosition: Record<string, string>;
                LatLng: new (lat: number, lng: number) => KakaoLatLngInstance;
                Coords: new (x: number, y: number) => KakaoLatLngInstance;
                Map: new (
                    container: HTMLElement,
                    options: {
                        center: KakaoLatLngInstance;
                        level?: number;
                        draggable?: boolean;
                        zoomable?: boolean;
                        wheelZoom?: boolean;
                        tileAnimation?: boolean;
                    }
                ) => KakaoMap;
                MapTypeId: Record<string, unknown>;
                MarkerImage: new (
                    src: string,
                    size: KakaoSize,
                    options?: {
                        offset?: KakaoPointInstance;
                        alt?: string;
                        coords?: string;
                        shape?: string;
                    }
                ) => KakaoMarkerImage;
                Size: new (width: number, height: number) => KakaoSize;
                Point: new (x: number, y: number) => KakaoPointInstance;
                event: {
                    addListener: (
                        target: KakaoMap | KakaoMarker,
                        type: string,
                        handler: (event?: KakaoMouseEvent) => void
                    ) => void;
                    removeListener: (
                        target: KakaoMap | KakaoMarker,
                        type: string,
                        handler: (event?: KakaoMouseEvent) => void
                    ) => void;
                };
                services: {
                    Geocoder: new () => KakaoGeocoder;
                    Places: new () => KakaoPlaces;
                    Status: {
                        OK: string;
                        ZERO_RESULT: string;
                        ERROR: string;
                    };
                };
                load: (callback: () => void) => void;
                Marker: new (options: {
                    position: KakaoLatLngInstance;
                    map?: KakaoMap;
                    image?: KakaoMarkerImage;
                    title?: string;
                    draggable?: boolean;
                    clickable?: boolean;
                    zIndex?: number;
                    opacity?: number;
                    altitude?: number;
                    range?: number;
                }) => KakaoMarker;
                InfoWindow: new (options: {
                    position?: KakaoLatLngInstance;
                    content?: string | HTMLElement;
                    removable?: boolean;
                    zIndex?: number;
                }) => {
                    open: (map: KakaoMap, marker?: KakaoMarker) => void;
                    close: () => void;
                    setMap: (map: KakaoMap | null) => void;
                };
                CustomOverlay: new (options: {
                    position: KakaoLatLngInstance;
                    content: string | HTMLElement;
                    xAnchor?: number;
                    yAnchor?: number;
                    zIndex?: number;
                }) => {
                    setMap: (map: KakaoMap | null) => void;
                    setPosition: (position: KakaoLatLngInstance) => void;
                    setVisible: (visible: boolean) => void;
                };
            };
        };
    }
}

// Position 타입 정의
export type KakaoLatLng = { lat: number; lng: number };
export type KakaoPoint = { x: number; y: number };
export type KakaoPosition = KakaoLatLng | KakaoPoint;

// Define exportable map type
export type KakaoMapTypeId = "ROADMAP" | "SKYVIEW" | "HYBRID";

// 카카오맵 컨트롤 위치 타입을 내보내기
export type KakaoControlPosition =
    | "TOPLEFT"
    | "TOP"
    | "TOPRIGHT"
    | "LEFT"
    | "CENTER"
    | "RIGHT"
    | "BOTTOMLEFT"
    | "BOTTOM"
    | "BOTTOMRIGHT";

// Map Props 타입 정의
export interface MapProps {
    // 필수 props
    center: KakaoPosition;
    children?: ReactNode;

    // API 키 (index.html에 스크립트가 없을 경우 필요)
    apiKey?: string;

    // 지도 옵션
    className?: string;
    style?: React.CSSProperties;
    level?: number;
    maxLevel?: number;
    minLevel?: number;
    draggable?: boolean;
    zoomable?: boolean;
    wheelZoom?: boolean;
    disableDoubleClick?: boolean;
    disableDoubleClickZoom?: boolean;
    keyboardShortcuts?:
        | boolean
        | { enableMapMove: boolean; enableZoom: boolean };
    tileAnimation?: boolean;
    mapTypeControl?: boolean;
    mapTypeControlPosition?: KakaoControlPosition;
    zoomControl?: boolean;
    zoomControlPosition?: KakaoControlPosition;
    roadView?: boolean;
    traffic?: boolean;
    terrain?: boolean;
    clusterer?: boolean;

    // 지도 타입
    mapTypeId?: KakaoMapTypeId;

    // 이벤트 핸들러
    onCreate?: (map: KakaoMap, clusterer: KakaoClusterer | null) => void;
    onClick?: (mouseEvent: KakaoMouseEvent, map: KakaoMap) => void;
    onRightClick?: (mouseEvent: KakaoMouseEvent, map: KakaoMap) => void;
    onDoubleClick?: (mouseEvent: KakaoMouseEvent, map: KakaoMap) => void;
    onMouseMove?: (mouseEvent: KakaoMouseEvent, map: KakaoMap) => void;
    onDragStart?: (map: KakaoMap) => void;
    onDragEnd?: (map: KakaoMap) => void;
    onZoomChanged?: (map: KakaoMap) => void;
    onIdle?: (map: KakaoMap) => void;
    onTilesLoaded?: (map: KakaoMap, clusterer: KakaoClusterer | null) => void;
    onBoundsChanged?: (map: KakaoMap) => void;
    onCenterChanged?: (map: KakaoMap) => void;
    onProjectionChanged?: (map: KakaoMap) => void;
}

// MapMarker Props 타입 정의
export interface MapMarkerProps {
    position: KakaoPosition;
    image?: {
        src: string | React.ReactElement; // ReactElement를 지원하여 JSX SVG 직접 사용 가능
        size: { width: number; height: number };
        options?: {
            alt?: string;
            offset?: { x: number; y: number };
            coords?: string;
            shape?: string;
        };
    };
    title?: string;
    clickable?: boolean;
    draggable?: boolean;
    zIndex?: number;
    opacity?: number;
    altitude?: number;
    range?: number;

    // 클러스터링 옵션
    clustered?: boolean; // false면 클러스터에서 제외. undefined면 Map의 clusterer 설정에 따라 자동 결정
    clusterer?: KakaoClusterer; // 직접 클러스터러 인스턴스 전달 (고급 사용)

    // 이벤트 핸들러
    onClick?: (marker: KakaoMarker) => void;
    onMouseOver?: (marker: KakaoMarker) => void;
    onMouseOut?: (marker: KakaoMarker) => void;
    onDragStart?: (marker: KakaoMarker) => void;
    onDragEnd?: (marker: KakaoMarker) => void;

    // 상태
    visible?: boolean;
    children?: ReactNode;
}

// CustomOverlayMap props 타입 정의
export interface CustomOverlayMapProps {
    position: KakaoPosition;
    content?: React.ReactNode | string;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
    visible?: boolean;
    children?: React.ReactNode;
}

// InfoWindow Props 타입 정의
export interface InfoWindowProps {
    position?: KakaoPosition;
    content?: React.ReactNode | string | HTMLElement;
    disableAutoPan?: boolean;
    removable?: boolean;
    zIndex?: number;
    altitude?: number;
    range?: number;

    // 열림/닫힘 상태
    open?: boolean;

    // 이벤트 핸들러
    onCloseClick?: () => void;

    // 내부 사용 props (자동으로 주입됨)
    marker?: KakaoMarker;
}

// 검색 결과 타입 정의
export interface KakaoSearchResult {
    address: string;
    lat: number;
    lng: number;
    placeType?: string;
    placeName?: string;
    placeId?: string;
    roadAddress?: string;
}
