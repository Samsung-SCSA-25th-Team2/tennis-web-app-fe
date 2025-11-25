import {Button} from "@shared/components/atoms"

export function FilterBar() {

    // TODO: change buttons to switches
    // TODO: dropdowns
    return (
        <div className="flex flex-col gap-xs">
            <div className="flex justify-between">
                <Button buttonSize={'lg'}>LG</Button>
                <Button buttonSize={'lg'}>LG</Button>
            </div>
            <div className="flex justify-between">
                <Button buttonSize={'xl'}>XL</Button>
                <Button buttonSize={'sm'}>SM</Button>

            </div>
        </div>
    )
}
