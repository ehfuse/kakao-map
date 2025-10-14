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

import { InfoWindowProps } from "./types";
import { useMapContext } from "./hook/useKakaoLoader";
import { useEffect, useRef, useMemo } from "react";
import { parsePosition } from "./utils";

/**
 * InfoWindow 컴포넌트 (네이티브 카카오 InfoWindow)
 *
 * 카카오 기본 InfoWindow를 사용합니다.
 * - content: string 또는 HTMLElement만 지원
 * - 가볍고 빠름
 * - 스타일링 제한적 (카카오 기본 스타일)
 *
 * React 컴포넌트를 사용하려면 CustomOverlayInfoWindow를 사용하세요.
 *
 * @example
 * <InfoWindow content="<div>안녕하세요</div>" />
 */
export const InfoWindow: React.FC<InfoWindowProps> = ({
    position,
    content,
    removable = false,
    zIndex = 1000,
    open = true,
    onCloseClick,
    marker,
}) => {
    const { map, selectedMarker } = useMapContext();
    const infoWindowRef = useRef<any>(null);

    // marker가 selectedMarker와 같은지 확인하여 열림 여부 결정
    const shouldOpen = useMemo(() => {
        // marker prop이 있으면 selectedMarker와 비교
        if (marker) {
            return marker === selectedMarker && open;
        }
        // marker prop이 없으면 open prop만 사용
        return open;
    }, [marker, selectedMarker, open]);

    // 위치 결정
    const overlayPosition = useMemo(() => {
        if (marker) {
            return marker.getPosition();
        } else if (position) {
            return parsePosition(position);
        }
        return null;
    }, [marker, position]);

    // InfoWindow 생성 및 관리
    useEffect(() => {
        if (!map || !overlayPosition) return;

        // 기존 InfoWindow 정리
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }

        // 카카오 기본 InfoWindow 사용
        const contentString =
            typeof content === "string"
                ? content
                : (content as HTMLElement).outerHTML;

        const infoWindow = new window.kakao.maps.InfoWindow({
            content: contentString,
            removable: removable,
            zIndex: zIndex,
        });

        infoWindowRef.current = infoWindow;

        if (shouldOpen) {
            if (marker) {
                infoWindow.open(map, marker);
            } else {
                infoWindow.setPosition(overlayPosition);
                infoWindow.open(map);
            }
        }

        // 닫기 이벤트 처리
        if (removable && onCloseClick) {
            // InfoWindow의 닫기 버튼 클릭 이벤트는 카카오 API에서 자동 처리됨
            // 추가적인 콜백이 필요한 경우 여기서 처리
        }

        return () => {
            // cleanup
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
        };
    }, [
        map,
        overlayPosition,
        content,
        removable,
        zIndex,
        shouldOpen,
        marker,
        onCloseClick,
    ]);

    return null;
};
