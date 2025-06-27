<script setup lang="ts">
</script>

<template>
    <div style="display: flex; justify-content: space-between;">
        <button class="btn btn-neutral">Neutral</button>
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-secondary">Secondary</button>
        <button class="btn btn-accent">Accent</button>
        <button class="btn btn-info">Info</button>
        <button class="btn btn-success">Success</button>
        <button class="btn btn-warning">Warning</button>
        <button class="btn btn-error">Error</button>
    </div>
    <div style="display: flex; justify-content: space-between;">
        <button class="btn btn-soft">Default</button>
        <button class="btn btn-soft btn-primary">Primary</button>
        <button class="btn btn-soft btn-secondary">Secondary</button>
        <button class="btn btn-soft btn-accent">Accent</button>
        <button class="btn btn-soft btn-info">Info</button>
        <button class="btn btn-soft btn-success">Success</button>
        <button class="btn btn-soft btn-warning">Warning</button>
        <button class="btn btn-soft btn-error">Error</button>
    </div>

    <div>
        <button class="btn btn-outline">Default</button>
        <button class="btn btn-outline btn-primary">Primary</button>
        <button class="btn btn-outline btn-secondary">Secondary</button>
        <button class="btn btn-outline btn-accent">Accent</button>
        <button class="btn btn-outline btn-info">Info</button>
        <button class="btn btn-outline btn-success">Success</button>
        <button class="btn btn-outline btn-warning">Warning</button>
        <button class="btn btn-outline btn-error">Error</button>
    </div>

    <div>
        <!-- change popover-1 and --anchor-1 names. Use unique names for each dropdown -->
        <button class="btn" popovertarget="popover-1" style="anchor-name:--anchor-1">
            Button
        </button>
        <ul class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm" popover id="popover-1"
            style="position-anchor:--anchor-1">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
        </ul>
    </div>

    <div>

        <!-- You can open the modal using ID.showModal() method -->
        <button class="btn" onclick="my_modal_4.showModal()">open modal</button>
        <dialog id="my_modal_4" class="modal">
            <div class="modal-box w-11/12 max-w-5xl">
                <h3 class="text-lg font-bold">Hello!</h3>
                <p class="py-4">Click the button below to close</p>
                <div class="modal-action">
                    <form method="dialog">
                        <!-- if there is a button, it will close the modal -->
                        <button class="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
        <div>
            <span class="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
                <svg class="h-6 w-6 stroke-white">
                </svg>
            </span>
        </div>
        <h3 class="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight ">Writes upside-down</h3>
        <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm ">
            The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer
            space.
        </p>
    </div>







    <div>
        <ul class="list bg-base-100 rounded-box shadow-md">

            <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li>

            <li class="list-row">
                <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" />
                </div>
                <div>
                    <div>Dio Lupa</div>
                    <div class="text-xs uppercase font-semibold opacity-60">Remaining Reason</div>
                </div>
                <button class="btn btn-square btn-ghost">
                    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"
                            stroke="currentColor">
                            <path d="M6 3L20 12 6 21 6 3z"></path>
                        </g>
                    </svg>
                </button>
                <button class="btn btn-square btn-ghost">
                    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"
                            stroke="currentColor">
                            <path
                                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z">
                            </path>
                        </g>
                    </svg>
                </button>
            </li>

            <li class="list-row">
                <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp" />
                </div>
                <div>
                    <div>Ellie Beilish</div>
                    <div class="text-xs uppercase font-semibold opacity-60">Bears of a fever</div>
                </div>
                <button class="btn btn-square btn-ghost">
                    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"
                            stroke="currentColor">
                            <path d="M6 3L20 12 6 21 6 3z"></path>
                        </g>
                    </svg>
                </button>
                <button class="btn btn-square btn-ghost">
                    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"
                            stroke="currentColor">
                            <path
                                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z">
                            </path>
                        </g>
                    </svg>
                </button>
            </li>

            <li class="list-row">
                <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/3@94.webp" />
                </div>
                <div>
                    <div>Sabrino Gardener</div>
                    <div class="text-xs uppercase font-semibold opacity-60">Cappuccino</div>
                </div>
                <button class="btn btn-square btn-ghost">
                    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"
                            stroke="currentColor">
                            <path d="M6 3L20 12 6 21 6 3z"></path>
                        </g>
                    </svg>
                </button>
                <button class="btn btn-square btn-ghost">
                    <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"
                            stroke="currentColor">
                            <path
                                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z">
                            </path>
                        </g>
                    </svg>
                </button>
            </li>

        </ul>
    </div>
</template>

<style scoped></style>