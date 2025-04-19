// #region import
import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconGripVertical,
  IconPlus,
  // IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
// import {
//   ChartConfig,
//   // ChartContainer,
//   // ChartTooltip,
//   // ChartTooltipContent,
// } from "@/components/ui/chart"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import interact from "@interactjs/interact";
import '@interactjs/auto-start'
import '@interactjs/actions/drag'
import '@interactjs/actions/resize'
import '@interactjs/modifiers'

export const schema = z.object({
  name: z.string(),
  items: z.array(z.object({
      title: z.string(),
      start: z.number(),
      quarter: z.number(),
      duration: z.number(),
      color:z.string()
  }))
})

// #endregion

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.name} />,
  },
  // {
  //   id: "select",
  //   // header: ({ table }) => (
  //   //   <div className="flex items-center justify-center">
  //   //     <Checkbox
  //   //       checked={
  //   //         table.getIsAllPageRowsSelected() ||
  //   //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //   //       }
  //   //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //   //       aria-label="Select all"
  //   //     />
  //   //   </div>
  //   // ),
  //   // cell: ({ row }) => (
  //   //   <div className="flex items-center justify-center">
  //   //     <Checkbox
  //   //       checked={row.getIsSelected()}
  //   //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //   //       aria-label="Select row"
  //   //     />
  //   //   </div>
  //   // ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: () => "Name",
    cell: ({ row }) => {
      return <TableCellViewer item={ row.original}/>
    },
    enableHiding: false,
  },
   {
    accessorKey: "items",
    header: () => (
      <>
        <div className="grid grid-cols-4 gap-1 text-center text-white *:text-white *:bg-blue-800 *:rounded-sm *:my-1">
			    <span>2024</span><span>2025</span><span>2026</span>
			    <span>2027</span>
		    </div>
        <div className="grid grid-cols-4 gap-1 mb-1">
          <div className="grid grid-cols-4 gap-1 text-center *:text-white *:bg-blue-800 *:rounded-sm">
            <span>I</span><span>II</span><span>III</span><span>IIII</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center *:text-white *:bg-blue-800 *:rounded-sm">
            <span>I</span><span>II</span><span>III</span><span>IIII</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center *:text-white *:bg-blue-800 *:rounded-sm">
            <span>I</span><span>II</span><span>III</span><span>IIII</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center *:text-white *:bg-blue-800 *:rounded-sm">
            <span>I</span><span>II</span><span>III</span><span>IIII</span>
          </div>
        </div>
      </>
        ),
    cell: ({ row }) => (
      <div className="grid grid-cols-16 gap-1">
              {row.original.items.map((i, index) => (
                //<div className="draggabble rounded-2xl p-1 text-center text-white" key={index} style={{gridColumn: `${i.quarter}/${i.duration}`, backgroundColor: i.color, resize: "horizontal"}}>{i.title}</div>
                <DraggableResizableItem item={i} key={index} />                
              ))}
      </div>
    ),
  },
  //#region backup
  // {
  //   accessorKey: "type",
  //   header: "Section Type",
  //   cell: ({ row }) => (
  //     <div className="w-32">
  //       <Badge variant="outline" className="text-muted-foreground px-1.5">
  //         {row.original.type}
  //       </Badge>
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <Badge variant="outline" className="text-muted-foreground px-1.5">
  //       {row.original.status === "Done" ? (
  //         <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
  //       ) : (
  //         <IconLoader />
  //       )}
  //       {row.original.status}
  //     </Badge>
  //   ),
  // },
  // {
  //   accessorKey: "target",
  //   header: () => <div className="w-full text-right">Target</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault()
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.header}`,
  //           success: "Done",
  //           error: "Error",
  //         })
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-target`} className="sr-only">
  //         Target
  //       </Label>
  //       <Input
  //         className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //         defaultValue={row.original.target}
  //         id={`${row.original.id}-target`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: "limit",
  //   header: () => <div className="w-full text-right">Limit</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault()
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.header}`,
  //           success: "Done",
  //           error: "Error",
  //         })
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
  //         Limit
  //       </Label>
  //       <Input
  //         className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //         defaultValue={row.original.limit}
  //         id={`${row.original.id}-limit`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: "reviewer",
  //   header: "Reviewer",
  //   cell: ({ row }) => {
  //     const isAssigned = row.original.reviewer !== "Assign reviewer"

  //     if (isAssigned) {
  //       return row.original.reviewer
  //     }

  //     return (
  //       <>
  //         <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
  //           Reviewer
  //         </Label>
  //         <Select>
  //           <SelectTrigger
  //             className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
  //             size="sm"
  //             id={`${row.original.id}-reviewer`}
  //           >
  //             <SelectValue placeholder="Assign reviewer" />
  //           </SelectTrigger>
  //           <SelectContent align="end">
  //             <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
  //             <SelectItem value="Jamik Tashpulatov">
  //               Jamik Tashpulatov
  //             </SelectItem>
  //           </SelectContent>
  //         </Select>
  //       </>
  //     )
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: () => (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button
  //           variant="ghost"
  //           className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
  //           size="icon"
  //         >
  //           <IconDotsVertical />
  //           <span className="sr-only">Open menu</span>
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="end" className="w-32">
  //         <DropdownMenuItem>Edit</DropdownMenuItem>
  //         <DropdownMenuItem>Make a copy</DropdownMenuItem>
  //         <DropdownMenuItem>Favorite</DropdownMenuItem>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   ),
  // },
  //#endregion
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.name,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

import { OutputType, Svg2Roughjs } from 'svg2roughjs';

function DraggableResizableItem({item}:{item:any}) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = React.useState(0);

  React.useEffect(() => {
    const updateGridWidth = () => {
      
      const parent = divRef.current?.parentElement;
      if (parent) {
        const computedStyle = window.getComputedStyle(parent);
         // Get the grid-template-columns property and count the number of columns
         const gridTemplateColumns = computedStyle.getPropertyValue("grid-template-columns");
         const columns = gridTemplateColumns.split(" ").length;
 
         const gap = parseFloat(computedStyle.gap || "0"); // Get the gap between grid items
         const totalGap = gap * (columns - 1); // Total gap space
         const availableWidth = parent.offsetWidth - totalGap; // Subtract gap space from parent width
         
        setGridWidth((availableWidth / columns) + gap); // Calculate the width of each grid cell
        console.log(`Grid Width: ${(availableWidth / columns) + gap} :${gap}`);
        
      }
    };

    // Update grid width on mount and window resize
    updateGridWidth();
    const parent = divRef.current?.parentElement;
    new ResizeObserver(updateGridWidth).observe(parent!);
    // if(parent){

    //   console.log(`Parent: ${parent}`);
      
    //   divRef.current?.closest(".grid")!.addEventListener("resize", updateGridWidth);
    // }
      
    // // Cleanup event listener on unmount
    // return () => {
    //   divRef.current?.closest(".grid")!.removeEventListener("resize", updateGridWidth);
    // };
  }, []);

  React.useEffect(() => {
    const target = divRef.current;
    
    const svg = divRef.current!.getElementsByTagName("svg")[0];
    const sketchySvg = divRef.current!.getElementsByTagName("svg")[1];
    // sketchySvg.outerHTML = '<svg className="absolute inset-0 h-[-webkit-fill-available] w-full -z-1" width="100%"></svg>'
    let svg2roughjs = new Svg2Roughjs(sketchySvg,OutputType.SVG, {
      // strokeWidth: 8, fillWeight: 3, 
      // hachureAngle: 0, // angle of hachure,
      // hachureGap: 2,
      // fillStyle: 'zigzag',
      stroke: "#000",
    });
    svg2roughjs.svg = svg    
    svg2roughjs.sketch()

    if (target && gridWidth > 0) {
      interact(target)
        .draggable({
          listeners: {
            move(event) {
              const x =
                (parseFloat(target.getAttribute("data-x") || "0")) + event.dx;

              target.style.transform = `translateX(${x}px)`;
              target.setAttribute("data-x", x);
            },
          },
          modifiers: [
            interact.modifiers.snap({
              targets: [
                //@ts-ignore
                interact.snappers.grid({
                  x: gridWidth,
                  y: 100, // Adjust this if you want snapping in the vertical direction                 
                }),
              ],
              offset:'parent',
              relativePoints: [ { x: 0, y: 0 } ]
            }),
            interact.modifiers.restrictRect({
              restriction: 'parent',
            })
          ],
        })
        .resizable({
          edges: { left: true, right: true },
          modifiers: [
            interact.modifiers.snapSize({
              targets: [
                //@ts-ignore
                interact.snappers.grid({
                  width: gridWidth,
                  height: 100,
                }),
              ],
              offset: { x: 4, y: 0 },
            }),
            interact.modifiers.restrictRect({
              restriction: 'parent',
            }),
            interact.modifiers.restrictSize({
              min: { width: gridWidth, height: 100 },
            })
          ],
          listeners: {
            move(event) {
              let { x, y } = event.target.dataset;

              x = (parseFloat(x) || 0) + event.deltaRect.left;
              y = (parseFloat(y) || 0) + event.deltaRect.top;

              Object.assign(event.target.style, {
                width: `${event.rect.width}px`,
                //height: `${event.rect.height}px`,
                transform: `translateX(${x}px)`,
              });

              Object.assign(event.target.dataset, { x, y });

              svg2roughjs.sketch()
            },
          },
        })
        // .on("dragstart", (event) => {
        //  console.log("dragstart", event.target.dataset);
        // })
        .on("dragend", (event) => {
         console.log(event);         
        })
    }

    
  }, [gridWidth]);
  
  return <div ref={divRef} className="relative cursor-grab box-border rounded-sm text-center opacity-95" style={{gridColumnStart: `${item.quarter}`, gridColumnEnd:`${item.duration}`}}>
    <svg  className="absolute inset-0 h-[-webkit-fill-available] w-full -z-1 opacity-0" xmlns="http://www.w3.org/2000/svg"  preserveAspectRatio="none" style={{maxHeight: "30px"}}>
    <rect width="100%" height="100%" rx="7"  fill={`${item.color}`}/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" className="fill-accent-foreground">{item.title}</text>
    </svg>
    <svg className="absolute inset-0 h-[-webkit-fill-available] w-full -z-1 **:[&_path]:opacity-60" width="100%"></svg>
   <span className="opacity-0">
     {item.title}
    </span> 
  </div>
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  // const [pagination, setPagination] = React.useState({
  //   pageIndex: 0,
  //   pageSize: 10,
  // })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ name }) => name) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      // pagination,
    },
    getRowId: (row) => row.name.toString(),
    // enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    // onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table className="table-auto">
            <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8 **:data-[slot=table-cell]:nth-2:w-8
              ">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

     </div>
  )
}

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--primary)",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "var(--primary)",
//   },
// } satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild className="w-max-fit ">
        <Button variant="link" className="truncate block text-foreground w-40 px-0 text-left">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.name}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )} */}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Name</Label>
              <Input id="header" defaultValue={item.name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Items</Label>
                <pre>
                  <code>
                    {JSON.stringify(item.items)}
                  </code>
                </pre>
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
