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

import { createRoot } from "react-dom/client";
import { InfoWindowProps } from "./types";
import { useMap } from "./hook/useKakaoLoader";
import { useEffect, useRef, useState } from "react";
import { parsePosition } from "./utils";

/**
 * InfoWindow 컴포넌트 (CustomOverlay 사용)
 */
export const InfoWindow: React.FC<InfoWindowProps> = ({
    position,
    content,
    removable = false,
    zIndex,
    open = true,
    onCloseClick,
    marker,
}) => {
    const map = useMap();
    const [overlay, setOverlay] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<any>(null);
    const isUnmountingRef = useRef(false);

    // 커스텀 오버레이 생성
    useEffect(() => {
        if (!map || isUnmountingRef.current) return;

        // 기존 오버레이 정리
        if (overlay) {
            overlay.setMap(null);
        }

        // 컨테이너 생성
        if (!containerRef.current) {
            containerRef.current = document.createElement("div");
            containerRef.current.className = "custom-info-window";
            containerRef.current.style.cssText = `
                position: relative;
                background-color: white;
                border: none;
                border-radius: 12px;
                padding: 16px;
                min-width: 280px;
                max-width: 320px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                font-size: 14px;
                word-wrap: break-word;
                overflow-wrap: break-word;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transform: translateY(-100%);
                margin-bottom: 15px;
            `;

            // 화살표 추가 (CSS로 만든 말풍선 꼬리)
            const arrow = document.createElement("div");
            arrow.style.cssText = `
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid white;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            `;
            containerRef.current.appendChild(arrow);

            // 닫기 버튼 추가 (removable이 true일 때만)
            if (removable && onCloseClick) {
                const closeButton = document.createElement("button");
                closeButton.innerHTML = "×";
                closeButton.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 24px;
                    height: 24px;
                    border: none;
                    background-color: #f1f3f4;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                `;

                closeButton.addEventListener("mouseenter", () => {
                    closeButton.style.backgroundColor = "#e8eaed";
                    closeButton.style.color = "#202124";
                });

                closeButton.addEventListener("mouseleave", () => {
                    closeButton.style.backgroundColor = "transparent";
                    closeButton.style.color = "#5f6368";
                });

                closeButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    onCloseClick();
                });

                containerRef.current.appendChild(closeButton);
            }
        }

        // 위치 결정
        let overlayPosition;
        if (marker) {
            overlayPosition = marker.getPosition();
        } else if (position) {
            overlayPosition = parsePosition(position);
        }

        console.debug("InfoWindow overlayPosition:", overlayPosition);

        if (!overlayPosition) {
            console.error("InfoWindow: 오버레이 위치를 결정할 수 없습니다.", {
                marker,
                position,
            });
            return;
        }

        // CustomOverlay 생성
        const overlayOptions: any = {
            content: containerRef.current,
            position: overlayPosition,
            xAnchor: 0.5,
            yAnchor: 1,
        };

        if (zIndex !== undefined) overlayOptions.zIndex = zIndex;

        const overlayInstance = new window.kakao.maps.CustomOverlay(
            overlayOptions
        );
        setOverlay(overlayInstance);
        return () => {
            if (overlayInstance) {
                overlayInstance.setMap(null);
            }
        };
    }, [map, removable, zIndex, onCloseClick, marker, position]);

    // 콘텐츠 렌더링
    useEffect(() => {
        if (!containerRef.current || isUnmountingRef.current || !content)
            return;

        // 기존 React 컴포넌트 정리
        if (rootRef.current) {
            try {
                rootRef.current.unmount();
            } catch (e) {
                // 이미 정리된 경우 무시
            }
            rootRef.current = null;
        }

        // 콘텐츠 컨테이너 찾기 (닫기 버튼이 있을 수 있으므로)
        let contentContainer = containerRef.current;
        let existingContent = contentContainer.querySelector(".info-content");

        if (!existingContent) {
            existingContent = document.createElement("div");
            existingContent.className = "info-content";
            (existingContent as HTMLElement).style.cssText = `
                margin-right: ${removable ? "32px" : "0"};
                line-height: 1.4;
            `;
            contentContainer.insertBefore(
                existingContent,
                contentContainer.firstChild
            );
        } else {
            existingContent = existingContent as HTMLElement;
        }

        // 문자열인 경우
        if (typeof content === "string") {
            existingContent.innerHTML = content;
            return;
        }

        // HTML 요소인 경우
        if (content instanceof HTMLElement) {
            existingContent.innerHTML = "";
            existingContent.appendChild(content);
            return;
        }

        // React 컴포넌트인 경우
        if (content && typeof content === "object") {
            try {
                rootRef.current = createRoot(existingContent);
                rootRef.current.render(content);
            } catch (e) {
                console.error("Error rendering InfoWindow content:", e);
            }
        }
    }, [content, removable]);

    // 오버레이 열기/닫기
    useEffect(() => {
        if (!overlay || !map || isUnmountingRef.current) return;

        try {
            if (open) {
                overlay.setMap(map);
            } else {
                overlay.setMap(null);
            }
        } catch (error) {
            console.error("Error opening/closing CustomOverlay:", error);
        }
    }, [overlay, map, open]);

    // 컴포넌트 정리
    useEffect(() => {
        return () => {
            isUnmountingRef.current = true;

            // React 컴포넌트 정리
            if (rootRef.current) {
                setTimeout(() => {
                    try {
                        rootRef.current?.unmount();
                    } catch {
                        // 이미 정리된 경우 무시
                    }
                    rootRef.current = null;
                }, 50);
            }
        };
    }, []);

    return null;
};
