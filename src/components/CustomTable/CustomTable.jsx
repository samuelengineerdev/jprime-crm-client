import React, { useEffect, useState } from "react";
import { Button, Card, CardFooter, Typography, Menu, MenuHandler, MenuList, MenuItem, Input } from "@material-tailwind/react";
import format from "../../utils/format";

function CustomTable({tableId, TABLE_HEAD, tableName, items, pagination, itemsPerPage, handleFormModalOpen, children, controls, controlActions, scroll, rowActions, actions, headClass }) {
  const [itemsToShow, setItemsToShow] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const itemsToShow = items?.slice((currentPage - 1) * (itemsPerPage || 10), currentPage * (itemsPerPage || 10));
    setItemsToShow(itemsToShow);
  }, [currentPage, items]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goNext = () => {
    const totalPages = Math.ceil(items.length / (itemsPerPage || 10));
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getNestedValue = (item, head) => {
    const keys = head.key.split(".");
    let value = item;

    for (const key of keys) {
      if (value && typeof value === "object") {
        value = value[key];
      } else {
        return undefined;
      }
    }

    if (head?.formatter) return head.formatter(value);

    return value;
  };

  const evaluateDynamicLogic = (logic, data) => {
    if (logic && data) {
      const formattedLogic = logic.replace(/"/g, "");
      try {
        return eval(formattedLogic);
      } catch (error) {
        console.error("Error evaluating logic:", error);
        return "";
      }
    }
    return "";
  };

  const getItemsToShow = () => {
    if (filterText?.length) return filteredItems;
    return pagination ? itemsToShow : items;
  };

  const itemsFilter = () => {
    const clientFiltered = items?.filter((item) => {
      return TABLE_HEAD.some((head) => {
        const keyArray = head.key.split(".");
        const itemValue = keyArray.reduce((acc, curr) => acc?.[curr], item);

        return itemValue && itemValue?.toString().toLowerCase().includes(filterText.toString().toLowerCase());
      });
    });
    if (filterText?.length > 0) {
      setFilteredItems(clientFiltered);
    } else {
      setFilteredItems(items);
    }
  };

  useEffect(() => {
    itemsFilter();
  }, [filterText]);

  return (
    <div>
      {controls && (
        <div className="flex justify-between items-cente pt-2">
          <div className="mt">
            <Typography className="font-inter font-normal text-2xl text-blue-gray-900">{tableName}</Typography>
          </div>
          <div className="flex justify-items-end gap-5">
            <div className="">
              <Input label="Search" color="purple" onChange={(e) => setFilterText(e.target.value)} className="font-inter" />
            </div>

            {/* <div className="">
            <Button color="purple" onClick={handleFormModalOpen} className="font-inter w-full">
              New Supplier
            </Button>
          </div> */}

            <div className="flex gap-3 items-center">
              {controlActions?.map((action, index) => (
                <i key={index} className={`${action.icon} text-color-1 text-lg cursor-pointer`} onClick={action.function}></i>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-full mt-5 ${scroll !== false ? "overflow-x-auto" : ""}`}>
        <Card className={`text-left shadow-none ${scroll !== false ? "min-w-max" : ""}`}>
          <table id={tableId}>
            <thead className="bg-color-1">
              <tr>
                {TABLE_HEAD?.map((head, index) => (
                  <th key={index} className={`border-b border-blue-gray-100 p-4  `}>
                    <Typography variant="small" color="blue-gray" className={`font-normal font-inter leading-none text-white whitespace-nowrap ${headClass}`}>
                      {head?.name}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getItemsToShow()?.map(({ id, ...item }, rowIndex) => {
                const isLast = rowIndex === itemsToShow?.length - 1;
                const classes = isLast ? "py-2 px-4" : "py-2 px-4 border-b border-blue-gray-50";

                return (
                  <tr key={rowIndex} className="">
                    {TABLE_HEAD?.map((head, colIndex) =>
                      colIndex < TABLE_HEAD.length - 1 ? (
                        <td className={classes} key={colIndex}>
                          <Typography variant="small" className="font-normal font-inter text-[#16191b]">
                            {/* {getNestedValue(item, head.key) || ""} */}
                            {getNestedValue(item, head) || ""}
                          </Typography>
                        </td>
                      ) : null
                    )}
                    {actions !== false ? (
                      <td className={classes} key={"ggw4g334g"}>
                        <Menu placement="bottom-end">
                          <MenuHandler>
                            <i className="fa-solid fa-bars cursor-pointer text-color-1 text-lg pl-4"></i>
                          </MenuHandler>
                          {rowActions && (
                            <MenuList>
                              {rowActions.map((action, index) => (
                                <MenuItem key={index} className="flex items-center  font-inter" onClick={() => action.function(id)}>
                                  <i className={`${action.icon} text-[#a229ab] text-xl mr-2`}></i>
                                  {action.name}
                                </MenuItem>
                              ))}
                            </MenuList>
                          )}
                        </Menu>
                      </td>
                    ) : (
                      <></>
                    )}
                  </tr>
                );
              })}
              {children}
            </tbody>
          </table>
          {pagination ? (
            <CardFooter className="w-full bordered border-x-0 flex items-center justify-between border-t border-blue-gray-50 p-4">
              <Typography variant="small" color="blue-gray" className="font-normal font-inter">
                Items {(currentPage - 1) * (itemsPerPage || 10) + 1} - {Math.min(currentPage * (itemsPerPage || 10), items.length)} of {items.length}
              </Typography>
              <div className="flex gap-2">
                <Button variant="text" size="sm" className="text-blue-gray font-inter font-semibold" onClick={goPrev}>
                  Previous
                </Button>
                <Button variant="text" size="sm" className="text-blue-gray font-inter font-semibold" onClick={goNext}>
                  Next
                </Button>
              </div>
            </CardFooter>
          ) : (
            <></>
          )}
        </Card>
      </div>
    </div>
  );
}

export default CustomTable;
