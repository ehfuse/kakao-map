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

// 컴포넌트 export
export { Map } from "./Map";
export { MapMarker } from "./Marker";
export { InfoWindow } from "./InfoWindow";
export { CustomInfoWindow } from "./CustomInfoWindow";
export { CustomOverlayMap } from "./CustomOverlay";

// 하위 호환성을 위한 alias
export { CustomInfoWindow as CustomOverlayInfoWindow } from "./CustomInfoWindow";

// 훅 export
export { useKakaoMap } from "./hook/useKakaoMap";
export { useMapContext } from "./hook/useKakaoLoader";
export { useMarkerContext } from "./Marker";

// 타입 export
export type {
    KakaoMap,
    KakaoLatLng,
    KakaoPosition,
    KakaoMapTypeId,
    KakaoControlPosition,
    KakaoMarker,
    KakaoClusterer,
    KakaoMouseEvent,
    KakaoSearchResult,
    MapProps,
    MapMarkerProps,
    InfoWindowProps,
    CustomOverlayInfoWindowProps,
    CustomOverlayMapProps,
    MapState,
} from "./types";
