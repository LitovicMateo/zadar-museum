import React from 'react';

import AboutMuseum from '@/components/Home/AboutMuseum';
import EntityGrid from '@/components/Home/EntityGrid';
import HeroBanner from '@/components/Home/HeroBanner';
import Legends from '@/components/Home/Legends';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper/DynamicContentWrapper';

const Home: React.FC = () => (
	<DynamicContentWrapper>
		<HeroBanner />
		<EntityGrid />
		<Legends />
		<AboutMuseum />
	</DynamicContentWrapper>
);

export default Home;
