export interface Ad {
    id: string;
    title: string;
    description: string;
    image?: string;
    targetLocation: string;
    budget: number;
    createdAt: Date;
    updatedAt: Date;
    vendorId: string;
}

export type AdCreateInput = Omit<Ad, 'id' | 'createdAt' | 'updatedAt'>;
export type AdUpdateInput = Partial<AdCreateInput>;