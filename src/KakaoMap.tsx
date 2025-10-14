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

import { Map } from "./Map";
import { MapMarker, useMarkerContext } from "./Marker";
import { InfoWindow } from "./InfoWindow";
import { CustomInfoWindow } from "./CustomInfoWindow";
import { CustomOverlayMap } from "./CustomOverlay";
import { useKakaoMap } from "./hook/useKakaoMap";
import { useMapContext } from "./hook/useKakaoLoader";
import { KakaoMapTypeId, KakaoControlPosition, MapState } from "./types";

// 하위 호환성을 위한 alias
const CustomOverlayInfoWindow = CustomInfoWindow;

// 공개 API - 컴포넌트와 훅만 export
// eslint-disable-next-line
export {
    Map,
    MapMarker,
    InfoWindow,
    CustomInfoWindow,
    CustomOverlayInfoWindow, // 하위 호환성을 위한 alias
    CustomOverlayMap,
    useKakaoMap, // All-in-One 훅 (모든 기능 포함)
    useMapContext, // MapContext 훅
    useMarkerContext, // MarkerContext 훅
};

// 관련 타입들도 함께 내보내기
export type { KakaoMapTypeId, KakaoControlPosition, MapState };

// 네임스페이스 객체로 기본 내보내기
const KakaoMap = {
    Map,
    MapMarker,
    InfoWindow,
    CustomInfoWindow,
    CustomOverlayInfoWindow, // 하위 호환성을 위한 alias
    CustomOverlayMap,
    useKakaoMap,
};

export default KakaoMap;
