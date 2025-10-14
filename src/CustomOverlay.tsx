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

import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { parsePosition } from "./utils";
import { useMap } from "./hook/useKakaoLoader";
import { CustomOverlayMapProps } from "./types";

// CustomOverlayMap 컴포넌트 정의 및 내보내기
export const CustomOverlayMap: React.FC<CustomOverlayMapProps> = ({
    position,
    content,
    zIndex,
    visible = true,
    children,
}) => {
    const map = useMap();
    const [overlay, setOverlay] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<any>(null);
    const overlayRef = useRef<any>(null);

    // 오버레이 생성
    useEffect(() => {
        if (!map || !window.kakao?.maps) return;

        // 컨테이너 생성 (한 번만)
        if (!containerRef.current) {
            containerRef.current = document.createElement("div");
            containerRef.current.className = "kakao-custom-overlay";
            // 클릭 이벤트를 허용하여 내부 요소 상호작용 가능하게 함
            containerRef.current.style.pointerEvents = "auto";

            // 지도 클릭 이벤트가 overlay까지 전파되지 않도록 막기
            containerRef.current.addEventListener("click", (e) => {
                e.stopPropagation();
            });
            containerRef.current.addEventListener("dblclick", (e) => {
                e.stopPropagation();
            });
            containerRef.current.addEventListener("mousedown", (e) => {
                e.stopPropagation();
            });
        }

        // React 루트 생성 (한 번만)
        if (children && !rootRef.current) {
            rootRef.current = createRoot(containerRef.current);
        }

        // children 렌더링
        if (children && rootRef.current) {
            rootRef.current.render(<>{children}</>);
        }

        const parsedPosition = parsePosition(position);
        if (!parsedPosition) return;

        const options: any = {
            position: parsedPosition,
            content: content || containerRef.current,
            map: visible ? map : null,
        };

        // 선택적으로 옵션 추가 (undefined면 카카오 API 기본값 사용)
        if (zIndex !== undefined) options.zIndex = zIndex;

        const overlayInstance = new window.kakao.maps.CustomOverlay(options);
        setOverlay(overlayInstance);
        overlayRef.current = overlayInstance;

        return () => {
            // useEffect cleanup에서는 오버레이만 제거
            if (overlayInstance) {
                overlayInstance.setMap(null);
            }
        };
    }, [map, position, content, children, zIndex, visible]);

    // position, visible 등 속성 업데이트
    useEffect(() => {
        if (!overlay || !window.kakao?.maps) return;

        const parsedPosition = parsePosition(position);
        if (parsedPosition) {
            overlay.setPosition(parsedPosition);
        }
    }, [overlay, position]);

    useEffect(() => {
        if (!overlay) return;
        overlay.setMap(visible ? map : null);
    }, [overlay, visible, map]);

    // children 업데이트
    useEffect(() => {
        if (children && rootRef.current) {
            rootRef.current.render(<>{children}</>);
        }
    }, [children]);

    // 컴포넌트 완전 언마운트 시에만 정리
    useEffect(() => {
        return () => {
            if (overlayRef.current) {
                overlayRef.current.setMap(null);
            }
            if (rootRef.current) {
                setTimeout(() => {
                    try {
                        rootRef.current?.unmount();
                    } catch (e) {
                        console.debug("React root already unmounted:", e);
                        // 이미 정리됨
                    }
                }, 100);
            }
        };
    }, []);

    return null;
};
