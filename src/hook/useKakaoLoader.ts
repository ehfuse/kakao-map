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

// Map Context 생성

import { createContext, useContext, MutableRefObject } from "react";
import type { KakaoMap, KakaoClusterer, KakaoMarker } from "../types";

// MapContext는 map 인스턴스, 클러스터러, 언마운트 플래그, 선택된 마커를 함께 전달
export interface MapContextValue {
    map: KakaoMap;
    clusterer: KakaoClusterer | null;
    isUnmountingRef: MutableRefObject<boolean>;
    selectedMarker: KakaoMarker | null;
    setSelectedMarker: (marker: KakaoMarker | null) => void;
}

export const MapContext = createContext<MapContextValue | null>(null);

// 맵 관련 훅

export const useMap = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error("useMap must be used within a Map Provider");
    }
    return context.map;
};

export const useMapContext = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error("useMapContext must be used within a Map Provider");
    }
    return context;
};
