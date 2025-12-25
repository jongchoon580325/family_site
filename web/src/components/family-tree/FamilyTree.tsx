'use client';

import { useRef, useState, useCallback } from 'react';
import { FamilyMember, Language, NodePosition, ConnectionInfo } from '@/types/family-tree';

interface TreeNodeProps {
    member: FamilyMember;
    language: Language;
    x: number;
    y: number;
    onPositionCalculated: (positions: NodePosition[], connections: ConnectionInfo[]) => void;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const HORIZONTAL_GAP = 50;
const VERTICAL_GAP = 100;

export function TreeNode({
    member,
    language,
    x,
    y,
}: TreeNodeProps) {
    const displayName = member.name[language];
    const spouseName = member.spouse ? member.spouse[language] : null;

    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Node Circle */}
            <circle
                cx={NODE_WIDTH / 2}
                cy={12}
                r={8}
                className="fill-pink-300 stroke-pink-400"
                strokeWidth={2}
            />

            {/* Name Label */}
            <text
                x={NODE_WIDTH / 2}
                y={32}
                textAnchor="middle"
                className="fill-stone-100 font-gowun text-sm"
                style={{ fontSize: '13px' }}
            >
                {spouseName ? (
                    <>
                        <tspan x={NODE_WIDTH / 2} dy="0">{displayName}</tspan>
                        <tspan x={NODE_WIDTH / 2} dy="14">{language === 'ko' ? `.${spouseName}` : `& ${spouseName}`}</tspan>
                    </>
                ) : displayName}
            </text>
        </g>
    );
}

// 트리 레이아웃 계산 함수
function calculateLayout(
    member: FamilyMember,
    x: number,
    y: number,
    positions: NodePosition[],
    connections: ConnectionInfo[]
): { width: number; positions: NodePosition[]; connections: ConnectionInfo[] } {

    const childrenCount = member.children.length;

    if (childrenCount === 0) {
        // 리프 노드
        positions.push({
            id: member.id,
            x,
            y,
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
        });
        return { width: NODE_WIDTH, positions, connections };
    }

    // 자식들의 레이아웃 먼저 계산
    let childrenTotalWidth = 0;
    const childLayouts: { member: FamilyMember; width: number; startX: number }[] = [];

    let currentX = 0;
    for (const child of member.children) {
        const { width } = calculateLayout(child, currentX, y + VERTICAL_GAP, [], []);
        childLayouts.push({ member: child, width, startX: currentX });
        currentX += width + HORIZONTAL_GAP;
        childrenTotalWidth = currentX - HORIZONTAL_GAP;
    }

    // 부모 노드의 X 위치 계산 (자식들의 중앙)
    const parentX = x + (childrenTotalWidth - NODE_WIDTH) / 2;

    positions.push({
        id: member.id,
        x: parentX,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
    });

    // 자식 노드들의 위치 계산 및 연결선 추가
    let childStartX = x;
    for (const childLayout of childLayouts) {
        const childResult = calculateLayout(
            childLayout.member,
            childStartX,
            y + VERTICAL_GAP,
            positions,
            connections
        );

        // 연결선 정보 추가
        const childPos = childResult.positions.find(p => p.id === childLayout.member.id);
        if (childPos) {
            connections.push({
                fromId: member.id,
                toId: childLayout.member.id,
                fromX: parentX + NODE_WIDTH / 2,
                fromY: y + 25,
                toX: childPos.x + NODE_WIDTH / 2,
                toY: childPos.y,
            });
        }

        childStartX += childLayout.width + HORIZONTAL_GAP;
    }

    return { width: childrenTotalWidth, positions, connections };
}

// SVG 베지어 곡선 경로 생성
function createBezierPath(conn: ConnectionInfo): string {
    const midY = (conn.fromY + conn.toY) / 2;
    return `M ${conn.fromX} ${conn.fromY} 
          C ${conn.fromX} ${midY}, 
            ${conn.toX} ${midY}, 
            ${conn.toX} ${conn.toY}`;
}

interface FamilyTreeProps {
    root: FamilyMember;
    language: Language;
}

export function FamilyTree({ root, language }: FamilyTreeProps) {
    // 레이아웃 계산
    const { positions, connections } = calculateLayout(root, 50, 30, [], []);

    // SVG 크기 계산
    const maxX = Math.max(...positions.map(p => p.x + p.width)) + 100;
    const maxY = Math.max(...positions.map(p => p.y + p.height)) + 50;

    // Drag-to-scroll state
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setStartY(e.pageY - containerRef.current.offsetTop);
        setScrollLeft(containerRef.current.scrollLeft);
        setScrollTop(containerRef.current.scrollTop);
        containerRef.current.style.cursor = 'grabbing';
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grab';
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const y = e.pageY - containerRef.current.offsetTop;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;
        containerRef.current.scrollLeft = scrollLeft - walkX;
        containerRef.current.scrollTop = scrollTop - walkY;
    }, [isDragging, startX, startY, scrollLeft, scrollTop]);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grab';
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="overflow-auto select-none"
            style={{ cursor: 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <svg
                width={maxX}
                height={maxY}
                className="min-w-full"
                style={{ minHeight: maxY }}
            >
                {/* 연결선 */}
                <g className="connections">
                    {connections.map((conn, index) => (
                        <path
                            key={`conn-${index}`}
                            d={createBezierPath(conn)}
                            fill="none"
                            stroke="#5eead4"
                            strokeWidth={2}
                            className="transition-all duration-300"
                        />
                    ))}
                </g>

                {/* 노드들 */}
                <g className="nodes">
                    {positions.map((pos) => {
                        const member = findMemberById(root, pos.id);
                        if (!member) return null;

                        const displayName = member.name[language];
                        const spouseName = member.spouse ? member.spouse[language] : null;
                        const isRoot = pos.id === 'god-father';
                        const fontSize = isRoot ? '24px' : '18px';
                        const lineHeight = isRoot ? 28 : 20;

                        return (
                            <g key={pos.id} transform={`translate(${pos.x}, ${pos.y})`}>
                                {/* Node Circle */}
                                <circle
                                    cx={NODE_WIDTH / 2}
                                    cy={12}
                                    r={isRoot ? 12 : 8}
                                    className="fill-pink-300 stroke-pink-400 cursor-pointer hover:fill-pink-400 transition-colors"
                                    strokeWidth={2}
                                />

                                {/* Name Label */}
                                <text
                                    x={NODE_WIDTH / 2}
                                    y={isRoot ? 40 : 35}
                                    textAnchor="middle"
                                    className={`fill-stone-100 font-gowun pointer-events-none ${isRoot ? 'font-bold' : ''}`}
                                    style={{ fontSize }}
                                >
                                    {spouseName ? (
                                        <>
                                            <tspan x={NODE_WIDTH / 2} dy="0">{displayName}</tspan>
                                            <tspan x={NODE_WIDTH / 2} dy={lineHeight}>{language === 'ko' ? `.${spouseName}` : `& ${spouseName}`}</tspan>
                                        </>
                                    ) : displayName}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}

// 헬퍼: ID로 멤버 찾기
function findMemberById(node: FamilyMember, id: string): FamilyMember | null {
    if (node.id === id) return node;
    for (const child of node.children) {
        const found = findMemberById(child, id);
        if (found) return found;
    }
    return null;
}

export default FamilyTree;
