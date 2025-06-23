// src/components/KebabMenu.jsx
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import clsx from 'classnames';

const actions = [
  { label: 'Share',   onClick: () => console.log('Share') },
  { label: 'Copy',    onClick: () => console.log('Copy') },
  { label: 'Embed',   onClick: () => console.log('Embed') },
  { label: 'Block',   onClick: () => console.log('Block') },
  { label: 'Report',  onClick: () => console.log('Report') },
];

export default function KebabMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* button */}
      <Menu.Button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200">
        <EllipsisVerticalIcon className="h-5 w-5" />
      </Menu.Button>

      {/* items */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="scale-95 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-95 opacity-0"
      >
        <Menu.Items
          className="absolute right-0 z-20 mt-2 w-40 origin-top-right
                     overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
        >
          <div className="py-1">
            {actions.map(({ label, onClick }) => (
              <Menu.Item key={label}>
                {({ active }) => (
                  <button
                    onClick={onClick}
                    className={clsx(
                      'flex w-full px-4 py-2 text-left text-sm',
                      active ? 'bg-indigo-500 text-white' : 'text-gray-800'
                    )}
                  >
                    {label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
